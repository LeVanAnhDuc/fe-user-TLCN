import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as en from '../locales/en';
import * as vi from '../locales/vi';

export const resources = {
    en: {
        speedDialSettingUI: en.SPEEDDIALSETTINGUI_EN,
        // home: en.HOME_EN,
        login: en.LOGIN_EN,
        register: en.REGISTER_EN,
        // header: en.HEADER_EN,
        // footer: en.FOOTER_EN,
        // listProduct: en.LISTPRODUCT_EN,
        // card: en.CARD_EN,
        // detailProduct: en.DETAILPRODUCT_EN,
        // cart: en.CART_EN,
        // checkOut: en.CHECKOUT_EN,
        // wishList: en.WISHLIST_EN,
        // purchaseHistory: en.PURCHASEHISTORY_EN,
        // error404: en.ERROR404_EN,
    },
    vi: {
        speedDialSettingUI: vi.SPEEDDIALSETTINGUI_VI,
        // home: vi.HOME_VI,
        login: vi.LOGIN_VI,
        register: vi.REGISTER_VI,
        // header: vi.HEADER_VI,
        // footer: vi.FOOTER_VI,
        // listProduct: vi.LISTPRODUCT_VI,
        // card: vi.CARD_VI,
        // detailProduct: vi.DETAILPRODUCT_VI,
        // cart: vi.CART_VI,
        // checkOut: vi.CHECKOUT_VI,
        // wishList: vi.WISHLIST_VI,
        // purchaseHistory: vi.PURCHASEHISTORY_VI,
        // error404: vi.ERROR404_VI,
    },
} as const;

export const defaultNS = '';

i18n.use(initReactI18next).init({
    resources,
    lng: 'vi',
    ns: [
        'speedDialSettingUI',
        // 'home',
        'login',
        'register',
        // 'header',
        // 'footer',
        // 'listProduct',
        // 'card',
        // 'detailProduct',
        // 'cart',
        // 'checkOut',
        // 'wishList',
        // 'purchaseHistory',
        // 'error404',
    ],
    defaultNS,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
