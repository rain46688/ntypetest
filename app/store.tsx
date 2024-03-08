import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 신규 데이터 추가시 임포트 부분
import userReducer from '../slices/userSlice';
import layoutReducer from '../slices/layoutSlice';

export const store = configureStore({
  reducer: {
    userReducer,
    // 신규 데이터 추가시 수정 부분
    layoutReducer,
  },
});

// 밑에 부분은 걍 내비두기
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;