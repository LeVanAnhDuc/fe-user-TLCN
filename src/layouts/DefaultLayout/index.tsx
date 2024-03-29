import { ReactNode } from 'react';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SpeedDialSettingUI from '../../components/SpeedDialSettingUI';

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="size-full dark:bg-dark-600">{children}</div>
            <Footer />
            <SpeedDialSettingUI />
        </div>
    );
}

export default DefaultLayout;
