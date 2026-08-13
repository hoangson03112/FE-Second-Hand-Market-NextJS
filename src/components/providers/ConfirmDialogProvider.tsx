'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
interface ConfirmDialogContextType {
  confirm: (options: { title: string; description: string; variant?: 'default' | 'destructive' }) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'default' | 'destructive';
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'default',
    resolve: null,
  });

  const confirm = useCallback((options: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        title: options.title,
        description: options.description,
        variant: options.variant || 'default',
        resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      
      {/* UI của Dialog (Bạn có thể thay bằng Component Modal/Dialog của bạn) */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-2">{state.title}</h2>
            <p className="text-muted-foreground mb-4">{state.description}</p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={handleCancel} 
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
              >
                Hủy
              </button>
              <button 
                onClick={handleConfirm} 
                className={`px-4 py-2 rounded text-white ${
                  state.variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmDialogContext);
  if (!context) throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  return context;
}
