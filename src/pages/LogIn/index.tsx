import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAppDispatch } from '../../redux/hook';
import { setInfoUser, setIsLogin } from './loginSlice';
import { getCartByToken } from '../../apis/cartApi';
import { getCountItemOfWishList } from '../../apis/followProductApi';
import { setItemsOfCart, setToTalPriceCart, setToTalProductCart } from '../Cart/cartSlice';
import { setToTalWishList } from '../Profile/Wishlist/wishListSlice';
import config from '../../config';
import { loginApi } from '../../apis/authApi';
import InputPassword from '../../components/InputPassword';
import Button from '../../components/Button';
import SnackBarLoading from '../../components/SnackBarLoading';
import AnimationTran from '../../components/AnimationTran';
import AnimationScale from '../../components/AnimationScale';
import { checkPassWord, checkUserNameAndEmail } from '../../utils/checkData';
import Logo from '../../components/Logo';

type FormDataLogin = {
    emailOrUserName: string;
    passWord: string;
};

const MESS_XACTHUC = 'Tài khoản chưa được xác thực';

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);

    const schema = yup.object().shape({
        emailOrUserName: yup.string().required('Tên tài khoản đang trống'),
        passWord: yup.string().required('Mật khẩu đang trống').min(8, 'Mật khẩu phải từ 8 kí tự trở lên'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataLogin>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataLogin> = async (data: FormDataLogin) => {
        if (!checkUserNameAndEmail(data.emailOrUserName)) {
            toast.error('Tên đăng nhập chưa đúng định dạng');
            return;
        }
        if (!checkPassWord(data.passWord)) {
            toast.error('Mật khẩu không chứa kí tự đặc biệt');
            return;
        }
        try {
            setIsLoadingLogin(true);
            const response = await loginApi(data.emailOrUserName, data.passWord);
            setIsLoadingLogin(false);

            if (response.status === 200 && response.data.jwt) {
                dispatch(setIsLogin(true));
                dispatch(
                    setInfoUser({
                        userNameUser: response.data.user.username,
                        idUser: response.data.user.id,
                        avatarUrl: response.data.user.avatarUrl,
                        nameUser: response.data.user.name,
                    }),
                );
                getTotalItemOfCartAndTotalWishList();
                navigate(config.Routes.home);
            } else if (response.data.message === MESS_XACTHUC) {
                toast.error(response.data.message);
                navigate(config.Routes.getOTPLogIn);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const getTotalItemOfCartAndTotalWishList = async () => {
        try {
            const [totalProductInWishList, itemOfCart] = await Promise.all([
                getCountItemOfWishList(),
                getCartByToken(),
            ]);

            if (itemOfCart.status === 200) {
                dispatch(setItemsOfCart(itemOfCart?.data?.cartItems));
                dispatch(setToTalPriceCart(itemOfCart?.data?.totalPrice));
                dispatch(setToTalProductCart(itemOfCart.data.totalItems));
            }
            if (totalProductInWishList.status === 200) {
                dispatch(setToTalWishList(+totalProductInWishList.data));
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            navigate(config.Routes.home);
        }
    }, []);

    return (
        <>
            <SnackBarLoading open={isLoadingLogin} content="Xác nhận đăng nhập" />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow">
                    <section className="w-full flex flex-col justify-center gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg">
                        <AnimationTran tranX={100} className="text-2xl font-bold text-gray-900">
                            Đăng nhập
                        </AnimationTran>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <AnimationTran tranX={100} delay={0.1}>
                                <>
                                    <Controller
                                        name="emailOrUserName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.emailOrUserName ? true : false}
                                                fullWidth
                                                label={'Nhập email hoặc tên tài khoản'}
                                                autoComplete="username"
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6">{errors.emailOrUserName?.message}</p>
                                </>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.2}>
                                <>
                                    <Controller
                                        name="passWord"
                                        control={control}
                                        render={({ field }) => (
                                            <InputPassword
                                                field={{ ...field }}
                                                error={errors.passWord ? true : false}
                                                label={'Nhập mật khẩu'}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6">{errors.passWord?.message}</p>
                                </>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.3} className="w-full flex justify-end">
                                <Button variant="text" size="small">
                                    <Link
                                        to={config.Routes.forgotPass}
                                        className="text-sm font-semibold text-gray-600 hover:text-black transition"
                                    >
                                        Quên mật khẩu
                                    </Link>
                                </Button>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.4}>
                                <Button type="submit" variant="fill" fullWidth loading={isLoadingLogin}>
                                    Đăng nhập
                                </Button>
                            </AnimationTran>
                        </form>
                        <AnimationTran tranY={100} delay={0.5} className="text-center text-sm text-gray-500">
                            <div className="flex place-content-center place-items-center">
                                Chưa có tài khoản?
                                <Button variant="text" size="small" className="!px-0">
                                    <Link
                                        to={config.Routes.register}
                                        className="pl-1 font-semibold text-base underline transition"
                                    >
                                        Đăng kí.
                                    </Link>
                                </Button>
                            </div>
                        </AnimationTran>
                    </section>
                    <section className="w-full h-full flex-col lg:flex hidden">
                        <AnimationScale className="m-auto">
                            <Logo />
                        </AnimationScale>
                        <div className="bg-login-banner bg-contain bg-no-repeat bg-center w-full h-full "></div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default LogIn;
