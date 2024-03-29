import { ReactNode } from 'react';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SideBarProfile from '../../components/SideBarProfile';
import ScrollButton from '../../components/ScrollButton/ScrollButton';
import SpeedDialSettingUI from '../../components/SpeedDialSettingUI';

interface ProfileUserLayoutProps {
    children: ReactNode;
}

function ProfileUserLayout({ children }: ProfileUserLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 relative dark:bg-dark-400">
            <Header />
            <div className="h-full flex gap-3 lg:gap-5 w-11/12 sm:w-10/12 m-auto py-10 relative">
                <div>
                    <SideBarProfile />
                </div>
                <div className="w-full">
                    <ScrollButton />
                    {children}
                </div>
            </div>
            <Footer />
            <SpeedDialSettingUI />
        </div>
    );
}

export default ProfileUserLayout;
