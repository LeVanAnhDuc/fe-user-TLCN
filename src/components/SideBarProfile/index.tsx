import Avatar from '@mui/material/Avatar';

import Home from '@mui/icons-material/Home';
import Favorite from '@mui/icons-material/Favorite';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import LockReset from '@mui/icons-material/LockReset';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import Place from '@mui/icons-material/Place';

import { NavLink } from 'react-router-dom';
import { ChangeEvent, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useAppSelector } from '../../redux/hook';
import { selectAvatarUrl, selectUserNameUser, selectNameUser, setAvatarUser } from '../../pages/LogIn/loginSlice';
import config from '../../config';
import { uploadAvatar } from '../../apis/uploadImageApi';
import SnackBarLoading from '../SnackBarLoading';

const SideBarProfile = () => {
    const userName = useAppSelector(selectUserNameUser);
    const name = useAppSelector(selectNameUser);
    const avatarUrl = useAppSelector(selectAvatarUrl);
    const dispatch = useDispatch();

    const inputRef = useRef<HTMLInputElement>(null);

    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLoadingAPI(true);

            const formData = new FormData();
            formData.append('image', e.target.files[0]);

            try {
                const response = await uploadAvatar(formData);

                if (response.status === 200) {
                    dispatch(setAvatarUser(response.data));
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            } finally {
                setLoadingAPI(false);
            }
        }
    };

    return (
        <>
            <SnackBarLoading open={isLoadingAPI} content={'Đang cập nhật ảnh'} />

            <section className="hidden lg:block h-fit w-full sticky top-20 space-y-7 bg-white p-5 rounded-lg">
                <div className="flex place-items-center gap-2">
                    <div className="size-fit rounded-full relative overflow-hidden flex justify-center items-center group">
                        <input
                            ref={inputRef}
                            className="absolute bottom-0 left-0 opacity-0 size-full"
                            type="file"
                            onChange={handleImageChange}
                        />
                        <Avatar
                            src={avatarUrl || undefined}
                            className="!size-14 cursor-pointer object-cover object-center"
                        />
                        <div
                            className="absolute bottom-0 size-full backdrop-blur-sm bg-white/10 transition  cursor-pointer hidden group-hover:block"
                            onClick={() => inputRef.current && inputRef.current.click()}
                        ></div>
                        <div
                            className="absolute bottom-0 transition duration-500 cursor-pointer translate-y-10 group-hover:-translate-y-1/2 "
                            onClick={() => inputRef.current && inputRef.current.click()}
                        >
                            <span className="text-primary-500 text-3xl font-bold select-none">+</span>
                        </div>
                    </div>
                    <div className="w-28">
                        <div className="font-bold text-lg truncate">{userName}</div>
                        <div className="text-sm truncate">{name}</div>
                    </div>
                </div>
                <div className="h-0.5 w-full bg-gray-100"></div>
                <nav className="h-full flex flex-col gap-7  text-gray-500 font-semibold">
                    <NavLink to={config.Routes.profileHomeProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'text-primary-500' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  cursor-pointer transition`}
                            >
                                Trang của tôi
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileFavouriteProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'text-primary-500' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  cursor-pointer transition`}
                            >
                                Danh sách ưu thích
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileAddressProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'text-primary-500' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  cursor-pointer transition`}
                            >
                                Danh sách địa chỉ
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileHistoryPaymentProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'text-primary-500' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  cursor-pointer transition`}
                            >
                                Lịch sử mua hàng
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileAccountProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'text-primary-500' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  cursor-pointer transition`}
                            >
                                Tài khoản của tôi
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profilePassWordProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'text-primary-500' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  cursor-pointer transition`}
                            >
                                Đổi mật khẩu
                            </div>
                        )}
                    </NavLink>
                </nav>
            </section>

            <div className="block lg:hidden sticky top-20 space-y-5">
                <div className="size-fit rounded-full relative overflow-hidden flex justify-center items-center group">
                    <input
                        ref={inputRef}
                        className="absolute bottom-0 left-0 opacity-0 size-full"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <Avatar
                        src={avatarUrl || undefined}
                        className="!size-14 cursor-pointer object-cover object-center"
                    />
                    <div
                        className="absolute bottom-0 size-full backdrop-blur-sm bg-white/10 transition  cursor-pointer hidden group-hover:block"
                        onClick={() => inputRef.current && inputRef.current.click()}
                    ></div>
                    <div
                        className="absolute bottom-0 transition duration-500 cursor-pointer translate-y-10 group-hover:-translate-y-1/2 "
                        onClick={() => inputRef.current && inputRef.current.click()}
                    >
                        <span className="text-primary-500 text-3xl font-bold select-none">+</span>
                    </div>
                </div>
                <nav className="h-full flex flex-col gap-3 bg-white rounded-lg text-gray-500 font-semibold ">
                    <NavLink to={config.Routes.profileHomeProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'bg-primary-500 text-white' : 'hover:text-primary-700 hover:scale-[1.03]'
                                } size-full cursor-pointer transition text-center rounded-lg p-3`}
                            >
                                <Home />
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileFavouriteProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'bg-primary-500 text-white' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  size-full cursor-pointer transition text-center rounded-lg p-3`}
                            >
                                <Favorite />
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileAddressProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'bg-primary-500 text-white' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  size-full cursor-pointer transition text-center rounded-lg p-3`}
                            >
                                <Place />
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileHistoryPaymentProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'bg-primary-500 text-white' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  size-full cursor-pointer transition text-center rounded-lg p-3`}
                            >
                                <ShoppingCart />
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profileAccountProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'bg-primary-500 text-white' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  size-full cursor-pointer transition text-center rounded-lg p-3`}
                            >
                                <ManageAccounts />
                            </div>
                        )}
                    </NavLink>
                    <NavLink to={config.Routes.profilePassWordProfile}>
                        {({ isActive }) => (
                            <div
                                className={`${
                                    isActive ? 'bg-primary-500 text-white' : 'hover:text-primary-700 hover:scale-[1.03]'
                                }  size-full cursor-pointer transition text-center rounded-lg p-3`}
                            >
                                <LockReset />
                            </div>
                        )}
                    </NavLink>
                </nav>
            </div>
        </>
    );
};

export default SideBarProfile;
