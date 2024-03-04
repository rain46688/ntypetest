"use client"

import Link from "next/link";
import { setCookie, getCookie, deleteCookie } from "@/utils/cookie";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { sendPost } from "@/utils/fetch";

export default function Header() {
    const userouter = useRouter();

    useEffect(() => {
        // 토큰 재발급 함수
        const refresh_jwtoken = async (user_id: string) => {
            const data = JSON.stringify({
                "user_id": user_id
            });

            const result = await sendPost(data, 'member/refresh');
            if (result.status == 'success') {
                // 재발급이가능한 경우
                setCookie("jtoken", result.data.jtoken, 5);
            } else {
                // 재발급이 불가능하면 그냥 메인으로 이동
                userouter.push('' + process.env.NEXT_PUBLIC_LOGIN_URL);
            }
        }

        // 토큰이 없으면 로그인 페이지로 이동
        const jtoken = getCookie("jtoken");
        if (jtoken == null) {
            const user_id = sessionStorage.getItem('user_id');
            if (user_id != null) {
                // 토큰 재발급 함수 호출
                refresh_jwtoken(user_id);
            }else{
                console.log("user_id 없음");
            }
        }
    }, []);

    // 로그 아웃 함수
    const handleLogout = () => {
        console.log(" === handleLogout === ");
        // 쿠키 삭제
        deleteCookie("jtoken");
        // 세션 스토리지 삭제
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('user_id');
        // 메인으로 라우팅
        userouter.push('' + process.env.NEXT_PUBLIC_LOGIN_URL);
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
