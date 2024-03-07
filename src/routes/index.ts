import { ReactNode } from 'react';

import config from '../config/index';
import Error404 from '../pages/Error404';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import DetailProduct from '../pages/DetailProduct';
import LogIn from '../pages/LogIn';
import Register from '../pages/Register';
import CheckOut from '../pages/CheckOut';
import Cart from '../pages/Cart';
import GetOTPRegister from '../pages/GetOTPRegister';
import GetOTPLogin from '../pages/GetOTPLogin';
import ForgotPassWord from '../pages/ForgotPassWord';

import Detail from '../pages/Profile/PurchaseHistory/Detail';
import { AddressList, Dashboard, ManagerPass, PurchaseHistory, Settings, Wishlist } from '../pages/Profile';
import ProfileUserLayout from '../layouts/ProfileUserLayout';

type TRouters = {
    path: string;
    component: React.ComponentType;
    layout?: React.ComponentType<{ children: ReactNode }> | null;
};

const publishRoute: Array<TRouters> = [
    { path: config.Routes.home, component: Home },
    { path: config.Routes.shop, component: Shop },
    { path: config.Routes.detailProductID, component: DetailProduct },
    { path: config.Routes.logIn, component: LogIn },
    { path: config.Routes.getOTPLogIn, component: GetOTPLogin },
    { path: config.Routes.forgotPass, component: ForgotPassWord },
    { path: config.Routes.register, component: Register },
    { path: config.Routes.getOTPRegister, component: GetOTPRegister },
    { path: config.Routes.cart, component: Cart },
    { path: config.Routes.checkOut, component: CheckOut },

    { path: config.Routes.profileHomeProfile, component: Dashboard, layout: ProfileUserLayout },
    { path: config.Routes.profileAccountProfile, component: Settings, layout: ProfileUserLayout },
    { path: config.Routes.profileAddressProfile, component: AddressList, layout: ProfileUserLayout },
    { path: config.Routes.profileFavouriteProfile, component: Wishlist, layout: ProfileUserLayout },
    { path: config.Routes.profileHistoryPaymentProfile, component: PurchaseHistory, layout: ProfileUserLayout },
    { path: config.Routes.profilePassWordProfile, component: ManagerPass, layout: ProfileUserLayout },

    { path: config.Routes.detailOrderID, component: Detail },
    { path: config.Routes.error, component: Error404, layout: null },
];

const privateRoute: Array<TRouters> = [
    { path: config.Routes.home, component: Home },
    { path: config.Routes.shop, component: Shop },
    { path: config.Routes.detailProductID, component: DetailProduct },
    { path: config.Routes.logIn, component: LogIn },
    { path: config.Routes.getOTPLogIn, component: GetOTPLogin },
    { path: config.Routes.forgotPass, component: ForgotPassWord },
    { path: config.Routes.register, component: Register },
    { path: config.Routes.getOTPRegister, component: GetOTPRegister },
    { path: config.Routes.error, component: Error404, layout: null },
];

export { publishRoute, privateRoute };
