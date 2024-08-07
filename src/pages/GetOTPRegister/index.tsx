// libs
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// components
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import SnackBarLoading from '@/components/SnackBarLoading';
import Logo from '@/components/Logo';
// apis
import { loginApi, sendOTPRegister, verifyOTPRegister } from '@/apis/authApi';
// redux
import { useAppSelector } from '@/redux/hook';
import { clearRegister, getDataRegister } from '../Register/registerSlice';
import { useAppDispatch } from '@/redux/hook';
import { setInfoUser, setIsLogin } from '../LogIn/loginSlice';
// others
import config from '@/config';

type FormDataGetOTPRegister = {
    otp: string;
};

const GetOTPRegister = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const dataRegister = useAppSelector(getDataRegister);
    const { t } = useTranslation('getOTPRegister');

    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [isLoadingSendOTPAgain, setIsLoadingSendOTPAgain] = useState(false);
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [verifyOTP, setVerifyOTP] = useState<boolean>(false);

    const schema = yup.object().shape({
        otp: yup
            .string()
            .required(t('otpIsRequired'))
            .min(4, t('otpLeast4'))
            .test('is-OTP', t('otpIsValidate'), function (value) {
                if (!value) return true;

                const numericRegex = /^[a-zA-Z0-9]+$/;
                return numericRegex.test(value);
            }),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataGetOTPRegister>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataGetOTPRegister> = async (data) => {
        if (!dataRegister.email) {
            toast.error(t('enterEmail'));
            navigate(config.Routes.getOTPLogIn);
            setVerifyOTP(false);
            return;
        }

        try {
            setIsLoadingSubmit(true);
            setTitleDialog(t('proceedWithCheckOTP'));
            const response = await verifyOTPRegister(dataRegister.email, data.otp);
            setIsLoadingSubmit(false);

            if (response.status === 200) {
                toast.success(response.data);
                setVerifyOTP(true);
            } else {
                toast.error(response.data.message || response.data);
                dispatch(clearRegister());
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleSendOTPAgain = async () => {
        if (!dataRegister.email) {
            toast.error(t('enterEmail'));
            navigate(config.Routes.getOTPLogIn);
            setVerifyOTP(false);
            return;
        }

        try {
            setIsLoadingSendOTPAgain(true);
            setTitleDialog(t('proceedWithSendOTP'));
            const response = await sendOTPRegister(dataRegister.email);
            setIsLoadingSendOTPAgain(false);

            if (response.status === 200) {
                toast.success(response.data);
            } else {
                toast.error(response.data.message || response.data);
                dispatch(clearRegister());
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleLogin = async () => {
        if (!dataRegister.email && !dataRegister.passWord) {
            navigate(config.Routes.logIn);
            return;
        }

        try {
            setIsLoadingLogin(true);
            setTitleDialog(t('proceedWithLogin'));
            const response = await loginApi(dataRegister.email, dataRegister.passWord);
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
                dispatch(clearRegister());
                navigate(config.Routes.home);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <>
            <SnackBarLoading open={isLoadingSendOTPAgain || isLoadingSubmit || isLoadingLogin} content={titleDialog} />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center dark:from-primary-700 dark:via-primary-900 dark:to-primary-800">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow dark:bg-dark-600">
                    <section className="min-h-[31rem] w-full flex-col items-center lg:flex hidden">
                        <Logo />
                        <AnimationTran tranY={-100} className="m-auto">
                            <h5 className="leading-7 tracking-tight">{t('titleGetOTPRegister')}</h5>
                        </AnimationTran>
                        <div className="bg-register-banner bg-contain bg-no-repeat bg-center w-full h-full"></div>
                    </section>

                    <section className="w-full flex flex-col justify-center gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg dark:bg-dark-400">
                        <AnimationTran tranX={-100} className="text-2xl font-bold ">
                            {t('enterAuthCode')}
                        </AnimationTran>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <AnimationTran tranX={-100} delay={0.1}>
                                <>
                                    <Controller
                                        name="otp"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.otp ? true : false}
                                                fullWidth
                                                label={t('enterOTP')}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.otp?.message}
                                    </p>
                                </>
                            </AnimationTran>
                            <div className="grid grid-cols-2 gap-2">
                                <AnimationTran tranX={-100} delay={0.3}>
                                    <Button type="submit" variant="fill" fullWidth loading={isLoadingSubmit}>
                                        {t('otpAuthentication')}
                                    </Button>
                                </AnimationTran>
                                <AnimationTran tranX={-100} delay={0.2}>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        fullWidth
                                        disabled={verifyOTP ? false : true}
                                        loading={isLoadingLogin}
                                        onClick={handleLogin}
                                    >
                                        {t('loginNow')}
                                    </Button>
                                </AnimationTran>
                            </div>
                            <AnimationTran tranX={-100} delay={0.4}>
                                <Button
                                    variant="fill"
                                    fullWidth
                                    loading={isLoadingSendOTPAgain}
                                    onClick={handleSendOTPAgain}
                                >
                                    {t('sendOTPAgain')}
                                </Button>
                            </AnimationTran>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
};

export default GetOTPRegister;
