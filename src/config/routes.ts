const Routes = {
    home: '/',
    logIn: '/dang-nhap',
    register: '/dang-ki',
    getOTPRegister: '/xac-thuc-OTP',
    getOTPLogIn: '/xac-thuc-OTP-email',
    forgotPass: '/quen-mat-khau',
    shop: '/ds-san-pham',
    cart: '/gio-hang',
    checkOut: '/thanh-toan',
    detailProduct: '/chi-tiet-san-pham',
    detailProductID: '/chi-tiet-san-pham/:id',

    profileHomeProfile: '/trang-cua-ban',

    profileFavouriteProfile: '/danh-sach-uu-thich',
    profileAddressProfile: '/danh-sach-dia-chi',
    profileHistoryPaymentProfile: '/lich-su-mua-hang',
    profileAccountProfile: '/quan-li-ca-nhan',
    profilePassWordProfile: '/doi-mat-khau',
    detailOrder: '/chi-tiet-don-hang',
    detailOrderID: '/chi-tiet-don-hang/:id',

    tableSize: '/bang-size',
    policy: '/chinh-sach',

    error: '*',
};

export default Routes;
