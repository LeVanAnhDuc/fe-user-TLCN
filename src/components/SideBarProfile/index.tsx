import Avatar from '@mui/material/Avatar';

import { NavLink } from 'react-router-dom';

import { useAppSelector } from '../../redux/hook';
import { selectAvatarUrl, selectUserNameUser, selectnameUser } from '../../pages/LogIn/loginSlice';
import config from '../../config';

const SideBarProfile = () => {
    const userName = useAppSelector(selectUserNameUser);
    const name = useAppSelector(selectnameUser);
    const avatarUrl = useAppSelector(selectAvatarUrl);
    return (
        <>
            <section className="h-fit w-full sticky top-20 space-y-7 bg-white p-7 rounded-lg">
                <div className="flex place-items-center place-content-between gap-2">
                    <Avatar src={avatarUrl || undefined} className="!size-14" />
                    <div className="max-w-32">
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
        </>
    );
};

export default SideBarProfile;
