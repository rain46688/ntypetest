"use client"

import Link from 'next/link';
import * as React from 'react';
import { useNavbar } from '../../hooks/useNavbar';

// material-ui 관련 임포트
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function Navbar() {

    // Custom Hook 사용
    const { Drawer, setOpened, dispatch, isopened } = useNavbar();

    return (
        <Drawer variant="permanent" open={isopened as boolean | undefined}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}>
                <IconButton onClick={() => { dispatch(setOpened({ isopened: !isopened })) }}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                <React.Fragment>
                    <ListItemButton component={Link} href="/asset_type">
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="유형별 자산관리" />
                    </ListItemButton>
                    <ListItemButton component={Link} href="/asset_class">
                        <ListItemIcon>
                            <BarChartIcon />
                        </ListItemIcon>
                        <ListItemText primary="분류별 자산관리" />
                    </ListItemButton>
                </React.Fragment>
                <Divider sx={{ my: 1 }} />
            </List>
        </Drawer>
    )
}
