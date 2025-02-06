import type { Metadata } from "next";
import UpdateProfilePage from './Main'

export const metadata: Metadata = {
    title: "Profile | Mtaani FX",
    description: "Invest in your future",
};

export default function Page() {
    return (
        <>
            <UpdateProfilePage />
        </>
    );
};
