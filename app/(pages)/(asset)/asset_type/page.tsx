"use client"

import * as React from 'react';
import { useState, useEffect, useMemo, ChangeEvent, MouseEvent } from 'react';
import { sendGet } from "@/utils/fetch";
import { getComparator, stableSort, Order } from "@/utils/sort";
import { formatDate } from "@/utils/format";
import { EnhancedTableToolbar } from "@/components/asset/asset_type/TableHeaderToolbar";
import { EnhancedTableHead } from "@/components/asset/asset_type/TableHeader";
import { AssetTypeData, createData } from "../../../../types/asset/asset_type/AssetType";

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

export default function asset_type() {
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
  // 데이터를 담을 배열 관련
  const [rows, setRows] = useState<readonly AssetTypeData[]>([]);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const res = await sendGet('/asset/getlist_asset_type/' + id);
        const list = res.data;
        // 데이터 변환
        const newList = list.map((item: AssetTypeData) =>
          // 타입 변환 필요
          createData(item.id, item.asset_type, item.asset_acnt, item.asset_name, item.amount, item.earning_rate, formatDate(item.reg_date))
        );
        // 데이터 저장
        setRows(newList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 세션 스토리지에 저장된 id값 가져오기
    const id = sessionStorage.getItem('id');
    // id값으로 데이터 가져오기
    fetchData('' + id);
  }, []);

  // 화면에 뿌려질 데이터
  // useMemo는 특정 값이 변경될 때만 함수를 실행하고 그렇지 않으면 이전 값을 재사용
  const visibleRows = useMemo(
    () =>
      // 정렬 및 페이지 관련
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  // 정렬 관련
  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof AssetTypeData,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // 데이터 선택 관련
  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // 데이터 선택 관련
  const handleClick = (event: MouseEvent<unknown>, id: number) => {
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

  // 데이터 선택 관련
  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // 페이지 관련
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 페이지 관련
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 빈 행 관련
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
                    sx={{ cursor: 'pointer' }}>
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
                      scope="row"
                      align="center"
                      padding="none">
                      {row.asset_type}
                    </TableCell>
                    <TableCell align="center">{row.asset_acnt}</TableCell>
                    <TableCell align="center">{row.asset_name}</TableCell>
                    <TableCell align="center">{row.amount}</TableCell>
                    <TableCell align="center">{row.reg_date}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: ('small' ? 33 : 53) * emptyRows, // 테이블 사이즈 middle / small
                  }}>
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