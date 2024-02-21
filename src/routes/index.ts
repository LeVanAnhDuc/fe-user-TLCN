import config from '../config/index';
import Error404 from '../pages/Error404';
import Home from '../pages/Home/Home';
import Listproducts from '../pages/Listproducts/Listproducts';
import DetailProduct from '../pages/DetailProduct/DetailProduct';
import LogIn from '../pages/LogIn';
import Register from '../pages/Register';
import CheckOut from '../pages/CheckOut/CheckOut';
import Cart from '../pages/Cart/Cart';
import Profile from '../pages/Profile/Profile';
import GetOTPRegister from '../pages/GetOTPRegister';
import GetOTPLogin from '../pages/GetOTPLogin';
import ForgotPassWord from '../pages/ForgotPassWord';
import Detail from '../pages/Profile/PurchaseHistory/Detail/Detail';

type TRouters = {
    path: string;
    component: React.ComponentType;
    layout?: React.ComponentType | null;
};

const publishRoute: Array<TRouters> = [
    { path: config.Routes.home, component: Home },
    { path: config.Routes.listProducts, component: Listproducts },
    { path: config.Routes.detailProduct, component: DetailProduct },
    { path: config.Routes.logIn, component: LogIn },
    { path: config.Routes.getOTPLogIn, component: GetOTPLogin },
    { path: config.Routes.forgotPass, component: ForgotPassWord },
    { path: config.Routes.register, component: Register },
    { path: config.Routes.getOTPRegister, component: GetOTPRegister },
    { path: config.Routes.cart, component: Cart },
    { path: config.Routes.checkOut, component: CheckOut },
    { path: config.Routes.profile, component: Profile },
    { path: config.Routes.detailOrder, component: Detail },
    { path: config.Routes.error, component: Error404, layout: null },
];

const privateRoute: Array<TRouters> = [
    { path: config.Routes.home, component: Home },
    { path: config.Routes.listProducts, component: Listproducts },
    { path: config.Routes.detailProduct, component: DetailProduct },
    { path: config.Routes.logIn, component: LogIn },
    { path: config.Routes.getOTPLogIn, component: GetOTPLogin },
    { path: config.Routes.forgotPass, component: ForgotPassWord },
    { path: config.Routes.register, component: Register },
    { path: config.Routes.getOTPRegister, component: GetOTPRegister },
    { path: config.Routes.error, component: Error404, layout: null },
];

export { publishRoute, privateRoute };
