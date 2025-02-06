import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { cn } from "@/lib/utils"
import React from "react";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "Home | Mtaani FX",
    description: "Invest in your future",
};

// const darkTheme = createTheme({
//     palette: {
//         mode: 'dark',
//     },
// });

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        // TODO: production <html lang="en" suppressHydrationWarning>
        <html lang="en">
            <body>
                <ThemeProvider theme={lightTheme} defaultMode="system">
                    <CssBaseline />
                    <main
                        className={
                            cn("app-layout min-h-screen font-sans antialiased",
                                fontSans.variable
                            )
                        }>
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
