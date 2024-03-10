"use client"

import * as React from 'react';
import { useState, useEffect, useMemo, ChangeEvent, MouseEvent } from 'react';
import { sendGet, sendPut } from "@/utils/fetch";
import { formatDate } from "@/utils/format";
import { AssetTypeData, createData } from "@/types/asset/AssetType";
import { Order, getComparator, stableSort } from '@/utils/sort';
import { EnhancedTableHead } from "@/components/asset/asset_type/TableHeader";
import { EnhancedTableToolbar } from "@/components/asset/asset_type/TableHeaderToolbar";

// redux 관련 임포트
import { setAsset } from '@/slices/assetSlice';
import { useAppDispatch, useAppSelector } from '@/app/store';

// material-ui 관련 임포트
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import NativeSelect from '@mui/material/NativeSelect';
import Input from '@mui/material/Input';


export default function EnhancedTable() {
  // 정렬 ASC / DESC 관련
  const [order, setOrder] = useState<Order>('asc');
  // 정렬 기준 관련
  const [orderBy, setOrderBy] = useState<keyof AssetTypeData>('id');
  // 데이터 선택 관련
  const [selected, setSelected] = useState<readonly number[]>([]);
  // 페이지 관련
  const [page, setPage] = useState(0);
  // 화면에 뿌려지는 기본 데이터 갯수 관련
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // redux 관련 추가
  const dispatch = useAppDispatch();
  const rows = useAppSelector(state => state.assetReducer);

  // 데이터 가져오기
  useEffect(() => {
    const getList = async (id: string) => {
      const res = await sendGet('/asset/getlist_asset_type/' + id);
      if (res.status === 'success') {
        const list = res.data;
        // 데이터 변환
        const newList = list.map((item: AssetTypeData) =>
          // 타입 변환 필요
          createData(
            item.id,
            item.member_id,
            item.asset_type,
            item.asset_big_class,
            item.asset_mid_class,
            item.asset_acnt,
            item.asset_name,
            item.amount,
            item.earning_rate,
            formatDate(item.reg_date),
            formatDate(item.mod_date),
            item.use_flag
          )
        );
        // 데이터 저장
        dispatch(setAsset(newList));
      } else {
        console.log('error');
      }
    };

    // 세션 스토리지에 저장된 id값 가져오기
    const id = sessionStorage.getItem('id');
    // id값으로 데이터 가져오기
    getList('' + id);
  }, []);

  // 정렬 관련 함수
  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof AssetTypeData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // 데이터 선택 관련 함수
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // 데이터 선택 관련 함수
  const handleClick = (event: MouseEvent<unknown>, id: number) => {
    console.log(" ==== handleClick ==== ");
    const selectcheck = (event.target as HTMLInputElement).value;
    // console.log("selectcheck : ", selectcheck);

    // 체크박스가 아닌 곳을 클릭했을 때
    if (selectcheck != 'on') {
      return;
    }

    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  // 페이지 관련 함수
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 페이지 관련 함수
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 선택된 데이터 확인 함수
  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // 빈 행 계산
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // 화면에 뿌려질 데이터
  // useMemo는 특정 값이 변경될 때만 함수를 실행하고 그렇지 않으면 이전 값을 재사용  
  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  // 데이터 변경 함수
  const handleDataChange = (event: ChangeEvent<any>, id: number, field: string) => {
    console.log(" ==== handleChange ==== ");
    // console.log("id : ", id);
    // console.log("field : ", field);
    // console.log("e.target.value : ", event.target.value);
    // console.log("rows : ", rows);
    const updatedRows = rows.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: event.target.value
        };
      }
      return item;
    });

    // 수정된 배열을 설정
    dispatch(setAsset(updatedRows));
  };

  // 데이터 변경 함수
  const handleDataBlur = async (event: ChangeEvent<any>, id: number, field: string) => {
    console.log(" ==== handleDataBlur ==== ");
    // console.log("id : ", id);
    // console.log("field : ", field);
    // list에서 해당 아이디에 매칭되는 데이터를 뽑아옴
    const item = rows.find(item => item.id === id);
    // console.log("item : ", item);

    const data = JSON.stringify({
      "asset_type": item?.asset_type,
      "asset_name": item?.asset_name,
      "amount": item?.amount,
      "asset_acnt": item?.asset_acnt,
      "earning_rate": item?.earning_rate
    });

    const result = await sendPut(data, 'asset/update_asset/' + id);
    if (result.status === 'success') {
      console.log("수정 성공");
    } else {
      console.log("수정 실패");
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='small' // 테이블 사이즈 middle / small
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="center"
                      padding="none"
                      align="center">
                      <NativeSelect
                        value={row.asset_type}
                        onChange={(event: ChangeEvent<any>) => handleDataChange(event, row.id, 'asset_type')}
                        onBlur={(event: ChangeEvent<any>) => handleDataBlur(event, row.id, 'asset_type')}
                        style={{ width: '150px', border: 'none' }}
                        inputProps={{ 'aria-label': 'Without label' }}>
                        <option value={'투자'}>투자</option>
                        <option value={'입출식'}>입출식</option>
                        <option value={'예적금'}>예적금</option>
                      </NativeSelect>
                    </TableCell>
                    <TableCell align="center"><Input value={row.asset_acnt || ''}
                      onChange={(event: ChangeEvent<any>) => handleDataChange(event, row.id, 'asset_acnt')}
                      onBlur={(event) => handleDataBlur(event, row.id, 'asset_acnt')} />
                    </TableCell>
                    <TableCell align="center"><Input value={row.asset_name || ''}
                      onChange={(event: ChangeEvent<any>) => handleDataChange(event, row.id, 'asset_name')}
                      onBlur={(event) => handleDataBlur(event, row.id, 'asset_name')} />
                    </TableCell>
                    <TableCell align="center"><Input value={row.amount || 0}
                      onChange={(event: ChangeEvent<any>) => handleDataChange(event, row.id, 'amount')}
                      onBlur={(event) => handleDataBlur(event, row.id, 'amount')} />
                    </TableCell>
                    <TableCell align="center">{row.reg_date}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: ('small' ? 33 : 53) * emptyRows, // 테이블 사이즈 middle / small
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
