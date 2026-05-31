import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001";

async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
      refreshToken: token.refreshToken,
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      expiresAt: Number(refreshedTokens.expTime) * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginResponse = await axios.post(`${API_URL}/api/v1/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { accessToken, refreshToken, expTime } = loginResponse.data;

          const meResponse = await axios.get(`${API_URL}/api/v1/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = meResponse.data.user;

          return {
            id: userData.id,
            email: userData.data.email,
            firstName: userData.data.firstName,
            lastName: userData.data.lastName,
            avatarUrl: userData.data.avatarUrl,
            role: userData.data.role,
            accessToken,
            refreshToken,
            expTime,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.avatarUrl = user.avatarUrl;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = Number(user.expTime) * 1000;
        return token;
      }

      if (Date.now() < token.expiresAt - 10000) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        avatarUrl: token.avatarUrl,
        role: token.role,
      } as any;
      session.accessToken = token.accessToken;
      session.error = token.error;
      
      return session;
    }
  },
  events: {
    async signOut({ token }) {
      if (token?.accessToken) {
        try {
          await axios.post(`${API_URL}/api/v1/auth/logout`, {}, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });
        } catch (error) {
          console.error("Error logging out from backend:", error);
        }
      }
    }
  },
  session: {
    strategy: "jwt"
  }
};
