import { useState, useEffect } from 'react';
import Image from '../../../components/Image';
import logo from '../../../assets/img/BG 2.png';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Search from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';

import { Link, useNavigate } from 'react-router-dom';
import config from '../../../config';

import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { selectIsLogin, setIsLogin } from '../../../pages/LogIn/loginSlice';
import { selectToTalProductCart } from '../../../pages/Cart/totalProducCartSlice';

function Header() {
    const dispatch = useAppDispatch();
    const navaigate = useNavigate();
    // get userName
    let userName: string = '';
    let avatarUrl: string = '';
    const savedInfoUser = localStorage.getItem('infoUser');
    if (savedInfoUser) {
        const dataInfo = JSON.parse(savedInfoUser);
        userName = dataInfo.userName;
        avatarUrl = dataInfo.avatarUrl;
    }

    // handle logged
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('infoUser');
        localStorage.removeItem('totalProductInCart');
        dispatch(setIsLogin(false));
        navaigate('/');
        handlePopoverClose();
    };
    // check total product in cart
    const totalProductCart = useAppSelector(selectToTalProductCart);

    // check login
    const [checkLogin, setCheckLogin] = useState<boolean>(false);
    const check = useAppSelector(selectIsLogin);
    useEffect(() => {
        check ? setCheckLogin(true) : setCheckLogin(false);
    }, [check]);

    // handle scroll to fix header
    const [scroll, setScroll] = useState(false);
    const listenScrollEvent = () => {
        window.scrollY > 100 ? setScroll(true) : setScroll(false);
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

    return (
        <>
            <div
                className={`${
                    scroll ? 'bg-header shadow-xl fixed duration-200 ease-in ' : 'bg-transparent absolute '
                } h-18 flex flex-col justify-center items-center w-full z-50 top-0`}
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
                <div className="w-10/12 grid grid-flow-col grid-cols-3 place-content-between ">
                    <div className="h-full w-48 col-span-1">
                        <Link to={config.Routes.home}>
                            <Image src={logo} className="h-full w-full" />
                        </Link>
                    </div>
                    <form className="w-full h-full col-span-2 mt-2.5">
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Search className="mr-1 my-0.5" />
                            <TextField
                                className=" w-4/6 text-sm border-b"
                                id="standard-basic"
                                label="Tìm kiếm"
                                variant="standard"
                            />
                        </Box>
                    </form>

                    <div className="flex justify-end items-center md:gap-3 gap-0 col-span-1">
                        {checkLogin ? (
                            <>
                                <Link to={config.Routes.cart}>
                                    <IconButton aria-label="cart">
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
                                </Link>
                                <Button onClick={handlePopoverToggle}>
                                    <Avatar src={avatarUrl} alt="Đức" sx={{ width: 32, height: 32 }} />
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
