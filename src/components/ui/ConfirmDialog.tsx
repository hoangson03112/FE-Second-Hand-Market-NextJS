"use client";

import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";
import { createContext, useCallback, useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(
    (nextOptions: ConfirmOptions): Promise<boolean> => {
      setOptions(nextOptions);
      setIsOpen(true);
      return new Promise<boolean>((resolve) => {
        setResolvePromise(() => resolve);
      });
    },
    [],
  );

  const closeWith = useCallback(
    (value: boolean) => {
      if (resolvePromise) resolvePromise(value);
      setIsOpen(false);
      setOptions(null);
      setResolvePromise(null);
    },
    [resolvePromise],
  );

  const handleConfirm = useCallback(() => closeWith(true), [closeWith]);
  const handleCancel = useCallback(() => closeWith(false), [closeWith]);

  // The previous palette used `bg-destructive/10` + `text-destructive`, tokens
  // this project never defines, so the danger icon rendered with no colour at
  // all. The blush ramp is the real one.
  const getVariantConfig = () => {
    switch (options?.variant) {
      case "danger":
        return {
          iconWrap: "bg-blush-100",
          iconColor: "text-blush-700",
          icon: <IconAlertTriangle className="h-8 w-8" strokeWidth={1.75} />,
          confirmVariant: "destructive" as const,
        };
      case "warning":
        return {
          iconWrap: "bg-cream-200",
          iconColor: "text-luxury-champagne",
          icon: <IconAlertTriangle className="h-8 w-8" strokeWidth={1.75} />,
          confirmVariant: "default" as const,
        };
      default:
        return {
          iconWrap: "bg-taupe-100",
          iconColor: "text-taupe-700",
          icon: <IconInfoCircle className="h-8 w-8" strokeWidth={1.75} />,
          confirmVariant: "default" as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={isOpen && !!options}
        onOpenChange={(next) => {
          if (!next) handleCancel();
        }}
      >
        <DialogContent className="max-w-sm" showCloseButton>
          <DialogHeader className="items-center text-center">
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${config.iconWrap} ${config.iconColor}`}
            >
              {config.icon}
            </div>
            <DialogTitle>{options?.title || "Xác nhận"}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {options?.message}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:grid sm:grid-cols-2 sm:gap-3">
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
        </DialogContent>
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
