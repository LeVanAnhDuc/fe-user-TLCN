const Routes = {
    home: '/',
    logIn: '/dang-nhap',
    getOTPLogIn: '/xac-thuc-OTP-email',

    forgotPass: '/quen-mat-khau',

    register: '/dang-ki',
    getOTPRegister: '/xac-thuc-OTP',
    shop: '/ds-san-pham',
    cart: '/gio-hang',
    detailProduct: '/chi-tiet-san-pham',
    detailProductID: '/chi-tiet-san-pham/:id',
    checkOut: '/thanh-toan',

    profileHomeProfile: '/trang-cua-ban',
    profileFavouriteProfile: '/danh-sach-uu-thich',
    profileAddressProfile: '/danh-sach-dia-chi',
    profileHistoryPaymentProfile: '/lich-su-mua-hang',
    profileAccountProfile: '/quan-li-ca-nhan',
    profilePassWordProfile: '/doi-mat-khau',

    detailOrder: '/trang-cua-ban/chi-tiet-don-hang',
    error: '*',
};

export default Routes;
