"use client";

import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";
import { createContext, useCallback, useContext, useState } from "react";

import { Button } from "./Button";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((nextOptions: ConfirmOptions): Promise<boolean> => {
    setOptions(nextOptions);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const closeWith = useCallback(
    (value: boolean) => {
      if (resolvePromise) resolvePromise(value);
      setIsOpen(false);
      setOptions(null);
      setResolvePromise(null);
    },
    [resolvePromise]
  );

  const handleConfirm = useCallback(() => closeWith(true), [closeWith]);
  const handleCancel = useCallback(() => closeWith(false), [closeWith]);

  const getVariantConfig = () => {
    switch (options?.variant) {
      case "danger":
        return {
          iconWrap: "bg-destructive/10",
          iconColor: "text-destructive",
          icon: <IconAlertTriangle className="h-8 w-8" strokeWidth={1.75} />,
          confirmVariant: "danger" as const,
        };
      case "warning":
        return {
          iconWrap: "bg-amber-500/10",
          iconColor: "text-amber-500",
          icon: <IconAlertTriangle className="h-8 w-8" strokeWidth={1.75} />,
          confirmVariant: "primary" as const,
        };
      default:
        return {
          iconWrap: "bg-blue-500/10",
          iconColor: "text-blue-500",
          icon: <IconInfoCircle className="h-8 w-8" strokeWidth={1.75} />,
          confirmVariant: "primary" as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={isOpen && !!options}
        onClose={handleCancel}
        closeOnOverlayClick
        showCloseButton
        contentClassName="max-w-sm"
      >
        <DialogHeader className="pb-0 text-center">
          <div
            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${config.iconWrap} ${config.iconColor}`}
          >
            {config.icon}
          </div>
          <DialogTitle>{options?.title || "Xác nhận"}</DialogTitle>
        </DialogHeader>
        <DialogBody className="px-7 pb-6 pt-2 text-center">
          <DialogDescription className="text-sm leading-relaxed">
            {options?.message}
          </DialogDescription>
        </DialogBody>
        <DialogFooter className="border-t-0 px-6 pb-6 pt-0 sm:grid sm:grid-cols-2 sm:gap-3">
          <Button variant="outline" onClick={handleCancel} className="w-full">
            {options?.cancelText || "Hủy"}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            className="w-full"
          >
            {options?.confirmText || "Xác nhận"}
          </Button>
        </DialogFooter>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmDialogProvider");
  }
  return context;
}
