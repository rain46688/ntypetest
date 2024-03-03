"use client"

import Link from "next/link";
import { getCookie, deleteCookie } from "@/utils/cookie";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Header() {
    const userouter = useRouter();

    useEffect(() => {
        // 토큰이 없으면 로그인 페이지로 이동
        const jtoken = getCookie("jtoken");
        if (jtoken == null) {
            userouter.push(''+process.env.NEXT_PUBLIC_LOGIN_URL);
        }
    }, []);

    // 로그 아웃 함수
    const handleLogout = () =>{
        console.log(" === handleLogout === ");
        deleteCookie("jtoken");
        userouter.push(''+process.env.NEXT_PUBLIC_LOGIN_URL);
    }

    return (
        <header>
            <div className="left_area">
                <Link href="/" className="Main_btn">AssetInvader</Link>
            </div>
            <div className="right_area">
                <button className="logout_btn" onClick={handleLogout}>logout</button>
            </div>
        </header>
    )
}
