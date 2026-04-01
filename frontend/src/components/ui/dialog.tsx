'use client';

import * as React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`p-5 border-b border-gray-100 dark:border-gray-800 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}
