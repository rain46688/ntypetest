"use client"

import Link from "next/link";
import { useHeader } from "@/hooks/useHeader";

export default function Header() {

    // Custom Hook 사용
    const { handleLogout } = useHeader();

    return (
        <header>
            <div className="left_area">
                <Link href={'' + process.env.NEXT_PUBLIC_LOGIN_URL} className="Main_btn">AssetInvader</Link>
            </div>
            <div className="right_area">
                <button className="logout_btn" onClick={handleLogout}>logout</button>
            </div>
        </header>
    )
}
