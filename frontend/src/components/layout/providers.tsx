'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { ActiveThemeProvider } from '../active-theme';
export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          {children}
        </ActiveThemeProvider>
      </ThemeProvider>
    </>
  );
}
