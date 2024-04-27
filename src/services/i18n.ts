import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from '../locales/en';
import * as vi from '../locales/vi';

export const resources = {
    en: {
        speedDialSettingUI: en.SPEEDDIALSETTINGUI_EN,
        home: en.HOME_EN,
        login: en.LOGIN_EN,
        register: en.REGISTER_EN,
        getOTPRegister: en.GETOTPREGISTER_EN,
        getOTPLogin: en.GETOTPLOGIN_EN,
        forgotPassWord: en.FORGOTPASSWORD_EN,
        header: en.HEADER_EN,
        footer: en.FOOTER_EN,
        shop: en.SHOP_EN,
        card: en.CARD_EN,
        detailProduct: en.DETAILPRODUCT_EN,
        cart: en.CART_EN,
        checkOut: en.CHECKOUT_EN,
        myPage: en.MYPAGE_EN,
        wishList: en.WISHLIST_EN,
        purchaseHistory: en.PURCHASEHISTORY_EN,
        error404: en.ERROR404_EN,
        accountProfile: en.ACCOUNTPROFILE_EN,
        passWordProfile: en.PASSWORDPROFILE_EN,
        addressesProfle: en.ADDRESSESPROFLE_EN,
        sideBarProfile: en.SIDEBARPROFILE_EN,
        components: en.COMPONENTS_EN,
    },
    vi: {
        speedDialSettingUI: vi.SPEEDDIALSETTINGUI_VI,
        home: vi.HOME_VI,
        login: vi.LOGIN_VI,
        register: vi.REGISTER_VI,
        getOTPRegister: vi.GETOTPREGISTER_VI,
        getOTPLogin: vi.GETOTPLOGIN_VI,
        forgotPassWord: vi.FORGOTPASSWORD_VI,
        header: vi.HEADER_VI,
        footer: vi.FOOTER_VI,
        shop: vi.SHOP_VI,
        card: vi.CARD_VI,
        detailProduct: vi.DETAILPRODUCT_VI,
        cart: vi.CART_VI,
        checkOut: vi.CHECKOUT_VI,
        myPage: vi.MYPAGE_VI,
        wishList: vi.WISHLIST_VI,
        purchaseHistory: vi.PURCHASEHISTORY_VI,
        error404: vi.ERROR404_VI,
        accountProfile: vi.ACCOUNTPROFILE_VI,
        passWordProfile: vi.PASSWORDPROFILE_VI,
        addressesProfle: vi.ADDRESSESPROFLE_VI,
        sideBarProfile: vi.SIDEBARPROFILE_VI,
        components: vi.COMPONENTS_VI,
    },
} as const;

export const defaultNS = 'home';

i18n.use(initReactI18next).init({
    resources,
    lng: 'vi',
    ns: [
        'speedDialSettingUI',
        'home',
        'login',
        'register',
        'getOTPRegister',
        'getOTPLogin',
        'forgotPassWord',
        'header',
        'footer',
        'shop',
        'card',
        'detailProduct',
        'cart',
        'checkOut',
        'myPage',
        'wishList',
        'error404',
        'accountProfile',
        'passWordProfile',
        'addressesProfle',
        'sideBarProfile',
        'purchaseHistory',
        'components',
    ],
    defaultNS,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
