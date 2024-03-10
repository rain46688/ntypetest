import * as React from 'react';
import { sendPost } from '@/utils/fetch';
import { formatDate } from '@/utils/format';
import { createData } from '@/types/asset/AssetType';

// redux 관련 임포트
import { setAsset } from '@/slices/assetSlice';
import { useAppDispatch, useAppSelector } from '@/app/store';


// material-ui 관련 임포트
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface EnhancedTableToolbarProps {
  numSelected: number;
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const dispatch = useAppDispatch();
  const list = useAppSelector(state => state.assetReducer); // Redux 상태에서 필요한 데이터 읽어오기

  const handleAddList = async () => {
    console.log('=== handleAddList === ');
    console.log("list : ", list);
    const id = sessionStorage.getItem('id');
    const data = JSON.stringify({
      "member_id": id,
      "asset_type": "",
      "asset_big_class": "",
      "asset_mid_class": "",
      "asset_acnt": "",
      "asset_name": "",
      "amount": 0,
      "earning_rate": 0,
    });
    const result = await sendPost(data, 'asset/add_asset');
    if (result.status === 'success') {
      const data = result.data;
      const newList = [
        ...list,
        createData(
          data.id,
          data.member_id,
          data.asset_type,
          data.asset_big_class,
          data.asset_mid_class,
          data.asset_acnt,
          data.asset_name,
          data.amount,
          data.earning_rate,
          formatDate(new Date() + ''),
          formatDate(new Date() + ''),
          1
        )
      ];

      dispatch(setAsset(newList));
    } else {
      console.log("fail");
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}>
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div">
          AssetTypeList
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add">
          <IconButton onClick={handleAddList}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
