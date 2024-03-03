import React, { ReactNode } from 'react';
import Header from "../../components/layout/Header"
import Navbar from "../../components/layout/Navbar"

interface LayoutProps {
    children: ReactNode;
}

export default function Layout(props: LayoutProps) {
    return (
        <>
            <Header />
            <Navbar />
            <div className="content">
                {props.children}
            </div>
        </>
    );
}