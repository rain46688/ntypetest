"use client"
import { useState, useEffect } from "react";
import { setCookie, getCookie } from "@/utils/cookie";
import { sendPost } from "@/utils/fetch";
import { useRouter } from "next/navigation";
// redux 관련 임포트
import { useAppDispatch } from './store';
import { setUser } from '../slices/userSlice';
import { useAppSelector } from './store';

export default function LoginPage() {
  const userouter = useRouter();
  // redux 사용
  const dispatch = useAppDispatch();
  const user_id = useAppSelector(state => state.userReducer.user_id);
  const password = useAppSelector(state => state.userReducer.password);

  useEffect(() => {
    // 토큰이 존재하면 기본 페이지로 이동 (일단 유형별 자산관리 /asset_type)
    const jtoken = getCookie("jtoken");
    if (jtoken != null) {
      userouter.push('' + process.env.NEXT_PUBLIC_ROOT_URL);
    }
  }, []);

  // 로그인 함수
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log(" === handleLogin === ");
    // 화면 새로고침 방지
    event.preventDefault();

    const data = JSON.stringify({
      "user_id": user_id,
      "password": password
    });

    const result = await sendPost(data, 'member/login');
    if (result.status != 'fail') {
      // 토큰 값 쿠키에 저장
      setCookie("jtoken", result.data.jtoken, 5);
      // 성공 후 빈값으로 초기화
      dispatch(setUser({ user_id: '', password: ''}))
      // 성공 후 라우팅
      userouter.push('' + process.env.NEXT_PUBLIC_ROOT_URL);
    }
  }

  return (
    <main>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <label>Id : </label>
          <input
            type="text"
            value={user_id}
            onChange={(event) => dispatch(setUser({ user_id: event.target.value, password }))}
          />
        </div>
        <div>
          <label>Password : </label>
          <input
            type="password"
            value={password}
            onChange={(event) => dispatch(setUser({ user_id, password: event.target.value }))}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </main>
  );
}