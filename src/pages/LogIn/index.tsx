// libs
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hook';
// components
import InputPassword from '@/components/InputPassword';
import Button from '@/components/Button';
import SnackBarLoading from '@/components/SnackBarLoading';
import AnimationTran from '@/components/AnimationTran';
import AnimationScale from '@/components/AnimationScale';
import Logo from '@/components/Logo';
// apis
import { getCartByToken } from '@/apis/cartApi';
import { getCountItemOfWishList } from '@/apis/followProductApi';
import { loginApi } from '@/apis/authApi';
// redux
import { setInfoUser, setIsLogin } from './loginSlice';
import { setItemsOfCart, setToTalPriceCart, setToTalProductCart } from '../Cart/cartSlice';
import { setToTalWishList } from '../Profile/Wishlist/wishListSlice';
// others
import config from '@/config';
import { MESS_ACCURACY } from '@/constants';

type FormDataLogin = {
    emailOrUserName: string;
    passWord: string;
};

const LogIn = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation('login');

    const [isLoadingLogin, setIsLoadingLogin] = useState<boolean>(false);

    const schema = yup.object().shape({
        emailOrUserName: yup
            .string()
            .required(t('emailOrUserNameRequired'))
            .test('is-emailOrUserName', t('emailOrUserNameNotFormat'), function (value) {
                if (!value) return true;

                const regexUserName = /^(?:(?:\w{4,})|(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;

                return regexUserName.test(value);
            }),
        passWord: yup
            .string()
            .required(t('passwordIsRequired'))
            .test('is-passWord', t('passwordIsNotFormat'), function (value) {
                if (!value) return true;

                const regexUserName = /^[a-zA-Z0-9]+$/;

                return regexUserName.test(value);
            })
            .min(8, t('passwordLeast8')),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataLogin>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataLogin> = async (data: FormDataLogin) => {
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
            } else if (response.data.message === MESS_ACCURACY) {
                toast.error(t('accountNotAuthenticated'));
                navigate(config.Routes.getOTPLogIn);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(t('loginFailed'));
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
            console.log(`${error}`);
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
            <SnackBarLoading open={isLoadingLogin} content={t('confirmAccount')} />
            <div className="bg-gradient-to-r from-primary-400 via-primary-600 to-primary-500 flex place-content-center dark:from-primary-700 dark:via-primary-900 dark:to-primary-800">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow dark:bg-dark-600">
                    <section className="w-full flex flex-col justify-center gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg dark:bg-dark-400">
                        <AnimationTran tranX={100} className="text-2xl font-bold">
                            {t('login')}
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
                                                label={t('enterEmailOrUserName')}
                                                autoComplete="username"
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.emailOrUserName?.message}
                                    </p>
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
                                                label={t('enterPassword')}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.passWord?.message}
                                    </p>
                                </>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.3} className="w-full flex justify-end">
                                <Button variant="text" size="small">
                                    <Link to={config.Routes.forgotPass} className="text-sm font-semibold">
                                        {t('forgotPassword')}
                                    </Link>
                                </Button>
                            </AnimationTran>
                            <AnimationTran tranX={100} delay={0.4}>
                                <Button type="submit" variant="fill" fullWidth loading={isLoadingLogin}>
                                    {t('login')}
                                </Button>
                            </AnimationTran>
                        </form>
                        <AnimationTran tranY={100} delay={0.5} className="text-center text-sm ">
                            <div className="flex place-content-center place-items-center">
                                {t('noAccount')}
                                <Button variant="text" size="small" className="!px-0">
                                    <Link
                                        to={config.Routes.register}
                                        className="pl-1 font-semibold text-base underline transition"
                                    >
                                        {t('signUp')}.
                                    </Link>
                                </Button>
                            </div>
                        </AnimationTran>
                    </section>
                    <section className="w-full h-full flex-col lg:flex hidden">
                        <AnimationScale className="m-auto">
                            <Logo />
                        </AnimationScale>
                        <AnimationTran tranY={-100}>
                            <h5 className="leading-20 tracking-tight text-xl font-semibold text-center">
                                {t('titleLogin')}
                            </h5>
                        </AnimationTran>
                        <div className="bg-login-banner bg-contain bg-no-repeat bg-center w-full h-full "></div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default LogIn;
