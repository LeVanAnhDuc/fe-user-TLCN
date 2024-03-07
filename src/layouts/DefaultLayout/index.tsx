import { ReactNode } from 'react';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="size-full">{children}</div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
