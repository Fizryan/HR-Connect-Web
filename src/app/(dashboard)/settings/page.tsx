"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserApi } from "@/features/users/services/user-api";
import {
  type ChangePasswordFormValues,
  changePasswordSchema,
  type UserFormValues,
  userSchema,
} from "@/features/users/types";
import { queryKeys } from "@/lib/query-keys";
import type { ApiError } from "@/types/api";

export default function SettingsPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;
  const userId = session?.user?.id as string;
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser", userId],
    queryFn: () => UserApi.getUser(userId, token),
    enabled: !!userId && !!token,
  });

  const profileForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "staff",
    },
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        firstName: currentUser.data.firstName,
        lastName: currentUser.data.lastName,
        email: currentUser.data.email,
        role: currentUser.data.role as string,
      });
    }
  }, [currentUser, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      await UserApi.updateUser(userId, values, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser", userId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success("Profile updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (values: ChangePasswordFormValues) => {
      await UserApi.changePassword(
        { oldPassword: values.oldPassword, newPassword: values.newPassword },
        token,
      );
    },
    onSuccess: () => {
      passwordForm.reset();
      toast.success("Password changed successfully");
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and set your display preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card border shadow-sm p-1">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-4"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-4"
          >
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md px-4"
          >
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <p className="text-sm text-muted-foreground">
                Update your personal details and email address.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <form
                onSubmit={profileForm.handleSubmit((d) =>
                  updateProfileMutation.mutate(d),
                )}
                className="space-y-4 max-w-xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName")}
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName")}
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-xs text-destructive">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="mt-4"
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            )}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Change Password</h2>
              <p className="text-sm text-muted-foreground">
                Ensure your account is using a long, random password to stay
                secure.
              </p>
            </div>

            <form
              onSubmit={passwordForm.handleSubmit((d) =>
                changePasswordMutation.mutate(d),
              )}
              className="space-y-4 max-w-xl"
            >
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...passwordForm.register("oldPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.oldPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...passwordForm.register("newPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...passwordForm.register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="mt-4"
              >
                {changePasswordMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Update Password
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Customize the theme of HR Connect to your preference.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <Sun className="w-6 h-6" />
                </div>
                <span className="font-medium">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="p-3 bg-indigo-900 text-indigo-300 rounded-full">
                  <Moon className="w-6 h-6" />
                </div>
                <span className="font-medium">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-6 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${
                  theme === "system"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
              >
                <div className="p-3 bg-muted text-muted-foreground rounded-full">
                  <Monitor className="w-6 h-6" />
                </div>
                <span className="font-medium">System</span>
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
