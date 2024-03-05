"use client"

import { useLogin } from '../hooks/useLogin';
// redux 관련 임포트
import { setUser } from '../slices/userSlice';

export default function LoginPage() {
 
  // custom hook 사용
  const { handleLogin, dispatch, user_id, password} = useLogin();

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