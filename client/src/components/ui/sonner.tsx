"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          success: "toast-success",
          error: "toast-error",
          info: "toast-info",
          warning: "toast-warning",
        },
        style: {
          minHeight: "60px",
          padding: "12px 16px",
          fontSize: "14px",
          borderRadius: "8px",
        },
      }}
      style={
        {
          "--width": "420px",
        } as React.CSSProperties & Record<string, string>
      }
      {...props}
    />
  );
};

export { Toaster };
