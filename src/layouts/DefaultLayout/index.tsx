// libs
import { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpeedDialSettingUI from '@/components/SpeedDialSettingUI';
// apis
import { checkExpiredToken } from '@/apis/authApi';
// redux
import { setIsLogin } from '@/pages/LogIn/loginSlice';

interface DefaultLayoutProps {
    children: ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
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
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="size-full dark:bg-dark-600">{children}</div>
            <Footer />
            <SpeedDialSettingUI />
        </div>
    );
}

export default DefaultLayout;
