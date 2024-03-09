export interface AssetTypeData {
    id: number;
    asset_type: string;
    asset_acnt: string;
    asset_name: string;
    amount: number;
    earning_rate: number;
    reg_date: string;
}

export function createData(
    id: number,
    asset_type: string,
    asset_acnt: string,
    asset_name: string,
    amount: number,
    earning_rate: number,
    reg_date: string,
): AssetTypeData {
    return {
        id,
        asset_type,
        asset_acnt,
        asset_name,
        amount,
        earning_rate,
        reg_date,
    };
}