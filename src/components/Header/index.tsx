import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';
import Favorite from '@mui/icons-material/Favorite';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Fab from '@mui/material/Fab';

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import config from '../../config';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectAvatarUrl, selectIsLogin, selectUserNameUser, setIsLogin } from '../../pages/LogIn/loginSlice';
import { selectToTalProductCart } from '../../pages/Cart/cartSlice';
import { selectToTalWishList } from '../../pages/Profile/Wishlist/wishListSlice';
import Search from '../Search';
import Button from '../Button';
import Logo from '../Logo';
import CartModal from '../../pages/Cart/CartModal';

function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation('header');

    const userName = useAppSelector(selectUserNameUser);
    const avatarUrl = useAppSelector(selectAvatarUrl);
    const totalProductCart = useAppSelector(selectToTalProductCart);
    const totalWishList = useAppSelector(selectToTalWishList);
    const checkLogin = useAppSelector(selectIsLogin);

    const [search, setSearch] = useState<string>('');
    const [isDoneSearch, setDoneSearch] = useState<boolean>(false);
    const [anchorPopperAvatar, setAnchorPopperAvatar] = useState<HTMLElement | null>(null);
    const [menuResponsive, setMenuResponsive] = useState<boolean>(false);
    const [openCartModal, setOpenCartModal] = useState<boolean>(false);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('infoUser');
        localStorage.removeItem('totalProductInCart');
        localStorage.removeItem('totalWishList');
        localStorage.removeItem('productInCart');
        localStorage.removeItem('totalPriceInCart');
        dispatch(setIsLogin(false));
        navigate('/');
        handlePopoverClose();
    };

    const handlePopoverToggle = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorPopperAvatar(anchorPopperAvatar ? null : event.currentTarget);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setAnchorPopperAvatar(null);
    }, []);

    const toggleMenuResponsive = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setMenuResponsive(open);
    };

    const toggleDrawerCartModal = useCallback(() => {
        setOpenCartModal((prev) => !prev);
    }, []);

    useEffect(() => {
        if (isDoneSearch === true) {
            navigate(config.Routes.shop, { state: { searchItem: search } });
        }

        return () => setDoneSearch(false);
    }, [isDoneSearch]);

    return (
        <>
            <header className="sticky top-0 flex flex-col justify-center items-center w-full bg-white shadow z-50 dark:bg-dark-600">
                <div className="sm:w-10/12 w-11/12 flex justify-between items-center gap-3 py-3">
                    <div className="xl:hidden hover:cursor-pointer " onClick={toggleMenuResponsive(true)}>
                        <FilterListIcon fontSize="large" />
                    </div>
                    <Logo />
                    <div className="hidden xl:flex place-items-center gap-7 text-gray-500 font-semibold">
                        <NavLink to={config.Routes.home}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive
                                            ? 'text-primary-500 dark:text-primary-400'
                                            : 'hover:text-primary-700 hover:scale-[1.03] dark:text-white dark:hover:text-primary-400'
                                    } uppercase cursor-pointer transition `}
                                >
                                    {t('home')}
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.shop}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive
                                            ? 'text-primary-500 dark:text-primary-400'
                                            : 'hover:text-primary-700 hover:scale-[1.03] dark:text-white dark:hover:text-primary-400'
                                    } uppercase cursor-pointer transition `}
                                >
                                    {t('shop')}
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.policy}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive
                                            ? 'text-primary-500 dark:text-primary-400'
                                            : 'hover:text-primary-700 hover:scale-[1.03] dark:text-white dark:hover:text-primary-400'
                                    } uppercase cursor-pointer transition `}
                                >
                                    {t('policy')}
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.tableSize}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive
                                            ? 'text-primary-500 dark:text-primary-400'
                                            : 'hover:text-primary-700 hover:scale-[1.03] dark:text-white dark:hover:text-primary-400'
                                    } uppercase cursor-pointer transition `}
                                >
                                    {t('tableSize')}
                                </div>
                            )}
                        </NavLink>
                    </div>

                    <div className=" flex items-center justify-end gap-2">
                        <div className="w-56 h-full hidden xl:flex">
                            <Search
                                search={search}
                                setSearch={setSearch}
                                setDoneSearch={setDoneSearch}
                                placeholderSearch={t('placeholder')}
                            />
                        </div>
                        {checkLogin ? (
                            <>
                                <IconButton onClick={toggleDrawerCartModal}>
                                    <Badge
                                        badgeContent={totalProductCart}
                                        color="secondary"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        overlap="circular"
                                    >
                                        <ShoppingCartIcon />
                                    </Badge>
                                </IconButton>
                                <CartModal
                                    openCartModal={openCartModal}
                                    toggleDrawerCartModal={toggleDrawerCartModal}
                                />
                                <Link to={config.Routes.profileFavouriteProfile}>
                                    <IconButton>
                                        <Badge
                                            badgeContent={totalWishList}
                                            color="secondary"
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            overlap="circular"
                                        >
                                            <Favorite />
                                        </Badge>
                                    </IconButton>
                                </Link>
                                <div
                                    className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-400"
                                    onClick={handlePopoverToggle}
                                >
                                    <Avatar src={avatarUrl || undefined} alt="Avatar" sx={{ width: 32, height: 32 }} />
                                    <span className="text-base ml-1 font-medium normal-case text-black dark:text-white">
                                        {userName}
                                    </span>
                                </div>
                                <Popper
                                    open={Boolean(anchorPopperAvatar)}
                                    anchorEl={anchorPopperAvatar}
                                    onMouseLeave={handlePopoverClose}
                                    sx={{ zIndex: 60 }}
                                >
                                    <div className="flex flex-col text-sm text-gray-500 font-medium tracking-wider bg-white rounded dark:bg-dark-500 dark:text-white">
                                        <Link
                                            to={config.Routes.profileHomeProfile}
                                            className="hover:bg-gray-200 hover:text-primary-700 transition p-3"
                                        >
                                            {t('myAccount')}
                                        </Link>
                                        <Link
                                            to={config.Routes.profileHistoryPaymentProfile}
                                            className="hover:bg-gray-200 hover:text-primary-700 transition p-3"
                                        >
                                            {t('purchaseOrder')}
                                        </Link>
                                        <div
                                            className="hover:bg-gray-200 hover:text-primary-700 transition p-3 hover:cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            {t('logOut')}
                                        </div>
                                    </div>
                                </Popper>
                            </>
                        ) : (
                            <div className="text-gray-500 text-sm font-semibold flex gap-2 dark:text-dark-50">
                                <Link
                                    to={config.Routes.register}
                                    className="uppercase cursor-pointer hover:text-primary-900 dark:hover:text-primary-300"
                                >
                                    {t('register')}
                                </Link>
                                <div>|</div>
                                <Link
                                    to={config.Routes.logIn}
                                    className="uppercase cursor-pointer hover:text-primary-900 dark:hover:text-primary-300"
                                >
                                    {t('login')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <SwipeableDrawer
                anchor={'left'}
                open={menuResponsive}
                onClose={toggleMenuResponsive(false)}
                onOpen={toggleMenuResponsive(true)}
            >
                <div className="h-screen w-96 py-5 px-7 flex flex-col  gap-5">
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold tracking-wide">{t('navigation')}</span>
                        <Fab color="error" size="small">
                            <CloseIcon onClick={toggleMenuResponsive(false)} />
                        </Fab>
                    </div>
                    <Search
                        search={search}
                        setSearch={setSearch}
                        setDoneSearch={setDoneSearch}
                        placeholderSearch={t('placeholder')}
                    />
                    <div className="flex flex-col gap-3">
                        <NavLink to={config.Routes.home}>
                            {({ isActive }) => (
                                <Button variant={isActive ? 'fill' : 'text'} fullWidth>
                                    {t('home')}
                                </Button>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.shop}>
                            {({ isActive }) => (
                                <Button variant={isActive ? 'fill' : 'text'} fullWidth>
                                    {t('shop')}
                                </Button>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.policy}>
                            {({ isActive }) => (
                                <Button variant={isActive ? 'fill' : 'text'} fullWidth>
                                    {t('policy')}
                                </Button>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.tableSize}>
                            {({ isActive }) => (
                                <Button variant={isActive ? 'fill' : 'text'} fullWidth>
                                    {t('tableSize')}
                                </Button>
                            )}
                        </NavLink>
                    </div>
                </div>
            </SwipeableDrawer>
        </>
    );
}
export default Header;
