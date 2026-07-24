"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  itemName?: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title,
  itemName,
  description,
  confirmText = "Xóa",
  onConfirm,
  loading,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? "Xác nhận xóa"}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ??
              (itemName ? (
                <>
                  Bạn có chắc muốn xóa{" "}
                  <span className="font-semibold text-foreground">{itemName}</span>? Hành
                  động này không thể hoàn tác.
                </>
              ) : (
                "Bạn có chắc muốn xóa? Hành động này không thể hoàn tác."
              ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
