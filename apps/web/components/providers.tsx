"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MotionProvider } from "@/components/providers/motion-provider";

export function Providers({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce?: string;
}) {
  return (
    <SessionProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={["light", "dark"]}
        disableTransitionOnChange
        nonce={nonce}
      >
        <MotionProvider>{children}</MotionProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
