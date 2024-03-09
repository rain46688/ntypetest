import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetTypeData } from '@/types/asset/AssetType';

// 초기 상태 정의
const initialState: AssetTypeData[] = [];

const assetSlice = createSlice({
    name: 'asset',
    initialState: initialState,
    reducers: {
        // setAsset 액션 생성 함수
        setAsset: (state, action: PayloadAction<AssetTypeData[]>) => {
            const list: AssetTypeData[] = [];
            action.payload.forEach((item) => {
                list.push(item);
            });
            return list;
        },
        // 함수 추가 가능
    },
});

// 액션 및 리듀서 내보내기
export const { setAsset } = assetSlice.actions;
export default assetSlice.reducer;
