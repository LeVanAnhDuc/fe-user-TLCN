import { useState, useEffect } from 'react';
import Image from '../Image';
import logo from '../../assets/img/logoDuck.png';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';
import Store from '@mui/icons-material/Store';

import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';

import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { selectAvatarUrl, selectIsLogin, selectUserNameUser, setIsLogin } from '../../pages/LogIn/loginSlice';
import { selectToTalProductCart } from '../../pages/Cart/totalProducCartSlice';
import Favorite from '@mui/icons-material/Favorite';
import MouseOverPopover from '../MouseOverPopover/MouseOverPopover';
import Search from '../Search/Search';
import { selectToTalWishList } from '../../pages/Profile/Wishlist/wishListSlice';

function Header() {
    const dispatch = useAppDispatch();
    const navaigate = useNavigate();
    // get userName
    const userName = useAppSelector(selectUserNameUser);
    const avatarUrl = useAppSelector(selectAvatarUrl);

    // handle logged
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
    // check total product in cart
    const totalProductCart = useAppSelector(selectToTalProductCart);
    const totalWishList = useAppSelector(selectToTalWishList);

    // check login
    const [checkLogin, setCheckLogin] = useState<boolean>(false);
    const check = useAppSelector(selectIsLogin);
    useEffect(() => {
        check ? setCheckLogin(true) : setCheckLogin(false);
    }, [check]);

    // handle scroll to fix header
    const [scroll, setScroll] = useState(false);
    const listenScrollEvent = () => {
        window.scrollY > 1 ? setScroll(true) : setScroll(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent);
        return () => {
            window.removeEventListener('scroll', listenScrollEvent);
        };
    }, []);

    // handle Popover user login logout
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverToggle = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    // handle search
    const [search, setSearch] = useState<string>('');
    const [isDoneSearch, setDoneSearch] = useState<boolean>(false);
    useEffect(() => {
        if (isDoneSearch === true) {
            navaigate(config.Routes.listProducts + '#' + search);
        }
        return () => setDoneSearch(false);
    });
    return (
        <>
            <div
                className={`${
                    scroll ? 'bg-header shadow-md fixed' : 'bg-transparent absolute'
                } h-18 flex flex-col justify-center items-center w-full z-50`}
            >
                <div className="sm:w-10/12 w-11/12 flex justify-between gap-3">
                    <div className="h-full w-24  md:w-40 ">
                        <Link to={config.Routes.home}>
                            <Image src={logo} className="h-full w-full " />
                        </Link>
                    </div>
                    <div className="sm:w-120 w-full h-full flex justify-center items-center ">
                        {/* <div className="hidden sm:block"> */}
                        <Search setSearch={setSearch} setDoneSearch={setDoneSearch} />
                        {/* </div> */}
                    </div>
                    <div className="flex items-center md:gap-3 gap-0">
                        {checkLogin ? (
                            <>
                                <Link to={config.Routes.listProducts}>
                                    <IconButton>
                                        <MouseOverPopover content="Sản phẩm">
                                            <Store />
                                        </MouseOverPopover>
                                    </IconButton>
                                </Link>
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

                                <Button onClick={handlePopoverToggle}>
                                    <Avatar src={avatarUrl || undefined} alt="Avatar" sx={{ width: 32, height: 32 }} />
                                    <span className="text-base ml-1 font-medium normal-case text-black">
                                        {userName}
                                    </span>
                                </Button>
                                <Popper
                                    open={open}
                                    anchorEl={anchorEl}
                                    onMouseLeave={handlePopoverClose}
                                    sx={{ zIndex: 60 }}
                                >
                                    <div className="flex flex-col text-sm bg-white rounded">
                                        <Link
                                            to={config.Routes.profile + '#' + config.PageInProfile.homeProfile}
                                            className="hover:bg-slate-100 hover:text-red-400 p-3"
                                        >
                                            Tài khoản của tôi
                                        </Link>
                                        <Link
                                            to={
                                                config.Routes.profile + '#' + config.PageInProfile.historyPaymentProfile
                                            }
                                            className="hover:bg-slate-100 hover:text-red-400 p-3"
                                        >
                                            Đơn mua
                                        </Link>
                                        <div
                                            className="hover:bg-slate-100 hover:text-red-400 p-3"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </div>
                                    </div>
                                </Popper>
                            </>
                        ) : (
                            <>
                                <Link to={config.Routes.register} className="cursor-pointer">
                                    Đăng Kí
                                </Link>
                                <div>|</div>
                                <Link to={config.Routes.logIn} className="cursor-pointer">
                                    Đăng Nhập
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Header;
