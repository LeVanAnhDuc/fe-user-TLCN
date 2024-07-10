// libs
import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideBarProfile from '@/components/SideBarProfile';
import ScrollButton from '@/components/ScrollButton/ScrollButton';
import SpeedDialSettingUI from '@/components/SpeedDialSettingUI';
// apis
import { checkExpiredToken } from '@/apis/authApi';
// redux
import { setIsLogin } from '@/pages/LogIn/loginSlice';
interface ProfileUserLayoutProps {
    children: ReactNode;
}

function ProfileUserLayout({ children }: ProfileUserLayoutProps) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCheckToken = async (token: string) => {
        const response = await checkExpiredToken(token);
        if (response.status !== 200) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('infoUser');
            localStorage.removeItem('totalProductInCart');
            localStorage.removeItem('totalWishList');
            localStorage.removeItem('productPurchaseInCart');
            dispatch(setIsLogin(false));
            navigate('/');
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            handleCheckToken(accessToken);
        }
    }, []);
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
