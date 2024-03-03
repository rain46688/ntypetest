"use client"
import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/utils/cookie";
import { sendPost } from "@/utils/fetch";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const userouter = useRouter();
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // 토큰이 존재하면 기본 페이지로 이동 (일단 유형별 자산관리 /asset_type)
    const jtoken = getCookie("jtoken");
    if (jtoken != null) {
      userouter.push(''+process.env.NEXT_PUBLIC_ROOT_URL);
    }
  }, []);

  // 로그인 함수
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(" === handleLogin === ");
    // 화면 새로고침 방지
    event.preventDefault();

    const data = JSON.stringify({
      "user_id": userid,
      "password": password
    });

    const result = await sendPost(data, 'member/login');
    if (result.status != 'fail') {
      // 토큰 값 쿠키에 저장
      setCookie("jtoken", result.data.jtoken, 5);
      // 성공 후 라우팅
      userouter.push(''+process.env.NEXT_PUBLIC_ROOT_URL);
    }
  }

  return (
    <main>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <label>Id : </label>
          <input type="text" value={userid} onChange={(event) => setUserid(event.target.value)} />
        </div>
        <div>
          <label>Password : </label>
          <input type="text" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </main>
  );
}