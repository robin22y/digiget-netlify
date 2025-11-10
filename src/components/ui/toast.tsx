"use client";

import { Toaster, toast, type ToastOptions } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          borderRadius: "12px",
          background: "#1E3A5F",
          color: "#ffffff",
        },
        success: {
          style: { background: "#10B981", color: "#0f172a" },
        },
        error: {
          style: { background: "#DC2626" },
        },
      }}
    />
  );
}

export function showToast(message: string, options?: ToastOptions) {
  toast(message, options);
}

export const toastSuccess = (message: string, options?: ToastOptions) =>
  toast.success(message, options);

export const toastError = (message: string, options?: ToastOptions) =>
  toast.error(message, options);

