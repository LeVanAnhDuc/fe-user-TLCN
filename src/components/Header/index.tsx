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

import config from '../../config';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectAvatarUrl, selectIsLogin, selectUserNameUser, setIsLogin } from '../../pages/LogIn/loginSlice';
import { selectToTalProductCart } from '../../pages/Cart/totalProducCartSlice';
import { selectToTalWishList } from '../../pages/Profile/Wishlist/wishListSlice';
import MouseOverPopover from '../MouseOverPopover';
import Search from '../Search';
import Button from '../Button';
import Logo from '../Logo';

function Header() {
    const dispatch = useAppDispatch();
    const navaigate = useNavigate();

    const userName = useAppSelector(selectUserNameUser);
    const avatarUrl = useAppSelector(selectAvatarUrl);
    const totalProductCart = useAppSelector(selectToTalProductCart);
    const totalWishList = useAppSelector(selectToTalWishList);
    const checkLogin = useAppSelector(selectIsLogin);

    const [search, setSearch] = useState<string>('');
    const [isDoneSearch, setDoneSearch] = useState<boolean>(false);
    const [anchorPopperAvatar, setAnchorPopperAvatar] = useState<HTMLElement | null>(null);
    const [menuResponsive, setMenuResponsive] = useState<boolean>(false);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('infoUser');
        localStorage.removeItem('totalProductInCart');
        localStorage.removeItem('totalWishList');
        dispatch(setIsLogin(false));
        navaigate('/');
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

    useEffect(() => {
        if (isDoneSearch === true) {
            navaigate(config.Routes.listProducts + '#' + search);
        }
        return () => setDoneSearch(false);
    });
    return (
        <>
            <header className="sticky top-0 flex flex-col justify-center items-center w-full bg-white shadow z-50 ">
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
                                        isActive ? 'text-primary-500' : 'hover:text-primary-700'
                                    } uppercase cursor-pointer transition`}
                                >
                                    Trang chủ
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.listProducts}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive ? 'text-primary-500' : 'hover:text-primary-700'
                                    } uppercase cursor-pointer transition`}
                                >
                                    Cửa hàng
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={'Chính sách'}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive ? 'text-primary-500' : 'hover:text-primary-700'
                                    } uppercase cursor-pointer transition`}
                                >
                                    Chính sách
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={'Bảng size'}>
                            {({ isActive }) => (
                                <div
                                    className={`${
                                        isActive ? 'text-primary-500' : 'hover:text-primary-700'
                                    } uppercase cursor-pointer transition`}
                                >
                                    Bảng size
                                </div>
                            )}
                        </NavLink>
                    </div>

                    <div className=" flex items-center justify-end gap-2">
                        <div className="w-56 h-full hidden xl:flex">
                            <Search search={search} setSearch={setSearch} setDoneSearch={setDoneSearch} />
                        </div>
                        {checkLogin ? (
                            <>
                                <Link to={config.Routes.cart}>
                                    <IconButton>
                                        <MouseOverPopover content="Giỏ hàng">
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
                                        </MouseOverPopover>
                                    </IconButton>
                                </Link>
                                <Link to={config.Routes.profile + '#' + config.PageInProfile.favouriteProfile}>
                                    <IconButton>
                                        <MouseOverPopover content="Danh sách yêu thích">
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
                                        </MouseOverPopover>
                                    </IconButton>
                                </Link>
                                <div
                                    className="flex items-center px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                                    onClick={handlePopoverToggle}
                                >
                                    <Avatar src={avatarUrl || undefined} alt="Avatar" sx={{ width: 32, height: 32 }} />
                                    <span className="text-base ml-1 font-medium normal-case text-black">
                                        {userName}
                                    </span>
                                </div>
                                <Popper
                                    open={Boolean(anchorPopperAvatar)}
                                    anchorEl={anchorPopperAvatar}
                                    onMouseLeave={handlePopoverClose}
                                    sx={{ zIndex: 60 }}
                                >
                                    <div className="flex flex-col text-sm text-gray-500 font-medium tracking-wider bg-white rounded">
                                        <Link
                                            to={config.Routes.profile + '#' + config.PageInProfile.homeProfile}
                                            className="hover:bg-gray-200 hover:text-primary-700 transition p-3"
                                        >
                                            Tài khoản của tôi
                                        </Link>
                                        <Link
                                            to={
                                                config.Routes.profile + '#' + config.PageInProfile.historyPaymentProfile
                                            }
                                            className="hover:bg-gray-200 hover:text-primary-700 transition p-3"
                                        >
                                            Đơn mua
                                        </Link>
                                        <div
                                            className="hover:bg-gray-200 hover:text-primary-700 transition p-3"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </div>
                                    </div>
                                </Popper>
                            </>
                        ) : (
                            <div className="text-gray-500 font-semibold flex gap-2">
                                <Link
                                    to={config.Routes.register}
                                    className="uppercase cursor-pointer hover:text-primary-900"
                                >
                                    Đăng Kí
                                </Link>
                                <div>|</div>
                                <Link
                                    to={config.Routes.logIn}
                                    className="uppercase cursor-pointer hover:text-primary-900"
                                >
                                    Đăng Nhập
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
                        <span className="text-2xl font-bold tracking-wide">Danh mục</span>
                        <Fab color="error" size="small">
                            <CloseIcon onClick={toggleMenuResponsive(false)} />
                        </Fab>
                    </div>
                    <Search search={search} setSearch={setSearch} setDoneSearch={setDoneSearch} />
                    <div className="flex flex-col gap-3">
                        <NavLink to={config.Routes.home}>
                            {({ isActive }) => (
                                <Button className={`${isActive ? 'bg-primary-500' : ''} w-full`}>Trang chủ</Button>
                            )}
                        </NavLink>
                        <NavLink to={config.Routes.listProducts}>
                            {({ isActive }) => (
                                <Button className={`${isActive ? 'bg-primary-500' : ''} w-full`}>Cửa hàng</Button>
                            )}
                        </NavLink>
                        <NavLink to={'chinh sach'}>
                            {({ isActive }) => (
                                <Button className={`${isActive ? 'bg-primary-500' : ''} w-full`}>Chính sách</Button>
                            )}
                        </NavLink>
                        <NavLink to={'Bảng size'}>
                            {({ isActive }) => (
                                <Button className={`${isActive ? 'bg-primary-500' : ''} w-full`}>Bảng size</Button>
                            )}
                        </NavLink>
                    </div>
                </div>
            </SwipeableDrawer>
        </>
    );
}
export default Header;
