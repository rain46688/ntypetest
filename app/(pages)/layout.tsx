import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout(props: LayoutProps) {
    return (
        <>
            <h1>PageLayout</h1>
            <div className="content">
                {props.children}
            </div>
        </>
    );
}