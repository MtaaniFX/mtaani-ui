import type { Metadata } from "next";
import React from "react";
import ProfileView from './ProfileView'

export const metadata: Metadata = {
    title: "Profile",
    description: "View your profile details",
};

export default function Page({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <ProfileView />
            {children}
        </>
    );
}
