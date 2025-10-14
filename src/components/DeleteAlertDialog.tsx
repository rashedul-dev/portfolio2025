"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface DeleteAlertDialogProps {
  onConfirm: () => void; // ✅ called when user clicks "Continue"
  children?: ReactNode; // ✅ for button content (e.g. icon + text)
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "outline";
  size?: "sm" | "lg";
  disabled?: boolean;
}

export function DeleteAlertDialog({
  onConfirm,
  children = "Delete",
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
  variant = "outline",
  size = "sm",
  disabled = false,
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog>
      {/* 🧨 Trigger button */}
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} disabled={disabled}>
          {children}
        </Button>
      </AlertDialogTrigger>

      {/* 💬 Dialog */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
