"use client";

import { HelpCircle, Info, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [showSignOut, setShowSignOut] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="md:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="md:hidden text-lg font-bold tracking-tight text-primary">
          HR Connect
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <User className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl shadow-lg mt-2"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Manage your preferences
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-muted focus:bg-muted"
            >
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-muted focus:bg-muted"
            >
              <Link href="/faq" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>FAQ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="cursor-pointer hover:bg-muted focus:bg-muted"
            >
              <Link href="/about" className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:focus:bg-rose-950/50"
              onSelect={(e) => {
                e.preventDefault();
                setShowSignOut(true);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showSignOut} onOpenChange={setShowSignOut}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <LogOut className="h-5 w-5 text-rose-500" />
              Sign Out Confirmation
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Are you sure you want to sign out of HR Connect? You will need to
              log in again to access the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSignOut(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleSignOut}
              className="rounded-xl shadow-md shadow-rose-500/20"
            >
              Yes, Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
