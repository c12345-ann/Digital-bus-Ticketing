"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type ModalProps = {
  children: ReactNode;
  open: boolean;
  title: string;
  onClose: () => void;
};

export function Modal({ children, onClose, open, title }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-bold text-slate-950">
            {title}
          </h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            <X aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
