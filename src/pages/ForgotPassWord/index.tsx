// libs
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
// components
import { forgotPassWord } from '@/apis/userApi';
import SnackBarLoading from '@/components/SnackBarLoading';
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import InputPassword from '@/components/InputPassword';
// apis
import { sendOTPRegister, verifyOTPRegister } from '@/apis/authApi';
// others
import config from '@/config';

type FormDataForgotPassword = {
    otp: string;
    email: string;
    passWord: string;
    comfirmPassWord: string;
};

const ForgotPassWord = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('forgotPassWord');

    const [inputPass, setInputPass] = useState<boolean>(false);
    const [inputOTP, setInputOTP] = useState<boolean>(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [isLoadingGetOTP, setIsLoadingGetOTP] = useState(false);
    const [titleDialog, setTitleDialog] = useState<string>('');

    const schema = yup.object().shape({
        email: yup.string().required(t('emailIsRequired')).email(t('emailIsValidate')),
        otp: yup
            .string()
            .required(t('otpIsRequired'))
            .min(4, t('otpLeast4'))
            .test('is-OTP', t('otpIsValidate'), function (value) {
                if (!value) return true;

                const numericRegex = /^[a-zA-Z0-9]+$/;
                return numericRegex.test(value);
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
        comfirmPassWord: yup
            .string()
            .required(t('passwordIsRequired'))
            .test('is-passWord', t('passwordIsNotFormat'), function (value) {
                if (!value) return true;

                const regexUserName = /^[a-zA-Z0-9]+$/;

                return regexUserName.test(value);
            })
            .min(8, t('passwordLeast8'))
            .oneOf([yup.ref('passWord')], t('passwordConfirm')),
    });

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormDataForgotPassword>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataForgotPassword> = async (data) => {
        try {
            setIsLoadingSubmit(true);
            setTitleDialog(t('proceedChangePass'));
            const response = await forgotPassWord(data.email, data.passWord);
            setIsLoadingSubmit(false);

            if (response.status === 200) {
                toast.success(response.data);
                setInputPass(false);
                setInputOTP(false);
                navigate(config.Routes.logIn);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleSendOTPAgain = async () => {
        if (getValues().email) {
            setIsLoadingGetOTP(true);
            setTitleDialog(t('proceedWithSendOTP'));
            const response = await sendOTPRegister(getValues().email);
            setIsLoadingGetOTP(false);

            if (response.status === 200) {
                setInputOTP(true);
                toast.success(t('sendOTPSuccessful'));
            } else {
                toast.error(response.data.message || response.data);
            }
        } else {
            toast.error(t('emailIsEmpty'));
        }
    };

    const handleCheckOTP = async () => {
        try {
            setIsLoadingSubmit(true);
            setTitleDialog(t('proceedWithCheckOTP'));
            const response = await verifyOTPRegister(getValues('email'), getValues('otp'));
            setIsLoadingSubmit(false);

            if (response.status === 200) {
                toast.success(response.data);
                setInputPass(true);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <>
            <SnackBarLoading open={isLoadingSubmit || isLoadingGetOTP} content={titleDialog} />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center dark:from-primary-700 dark:via-primary-900 dark:to-primary-800">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow dark:bg-dark-600">
                    <section className="w-full flex flex-col justify-start gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg dark:bg-dark-400">
                        <AnimationTran tranX={100} className="text-2xl font-bold">
                            {t('forgotPassword')}
                        </AnimationTran>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <AnimationTran tranX={100} delay={0.1}>
                                <>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.email ? true : false}
                                                fullWidth
                                                label={t('enterEmail')}
                                                autoComplete="email"
                                                disabled={inputOTP ? true : false}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.email?.message}
                                    </p>
                                </>
                            </AnimationTran>

                            {inputOTP && (
                                <AnimationTran tranY={-100}>
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
                                                    disabled={inputPass ? true : false}
                                                />
                                            )}
                                        />
                                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                            {errors.otp?.message}
                                        </p>
                                    </>
                                </AnimationTran>
                            )}

                            {inputPass && (
                                <>
                                    <AnimationTran tranY={-100}>
                                        <>
                                            <Controller
                                                name="passWord"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputPassword
                                                        field={{ ...field }}
                                                        error={errors.passWord ? true : false}
                                                        label={t('enterNewPassword')}
                                                    />
                                                )}
                                            />
                                            <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                                {errors.passWord?.message}
                                            </p>
                                        </>
                                    </AnimationTran>
                                    <AnimationTran tranY={-100} delay={0.1}>
                                        <>
                                            <Controller
                                                name="comfirmPassWord"
                                                control={control}
                                                render={({ field }) => (
                                                    <InputPassword
                                                        field={{ ...field }}
                                                        error={errors.comfirmPassWord ? true : false}
                                                        label={t('enterConfirmNewPassword')}
                                                    />
                                                )}
                                            />
                                            <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                                {errors.comfirmPassWord?.message}
                                            </p>
                                        </>
                                    </AnimationTran>
                                </>
                            )}

                            {inputOTP &&
                                (inputPass ? (
                                    <AnimationTran tranY={-100} delay={0.1}>
                                        <Button type="submit" variant="fill" fullWidth loading={isLoadingSubmit}>
                                            {t('confirmNewPassword')}
                                        </Button>
                                    </AnimationTran>
                                ) : (
                                    <AnimationTran tranY={-100} delay={0.1}>
                                        <Button
                                            variant="fill"
                                            fullWidth
                                            loading={isLoadingSubmit}
                                            onClick={handleCheckOTP}
                                        >
                                            {t('otpAuthentication')}
                                        </Button>
                                    </AnimationTran>
                                ))}

                            {!inputPass && (
                                <AnimationTran tranX={100} delay={0.3}>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={handleSendOTPAgain}
                                        loading={isLoadingGetOTP}
                                    >
                                        {!inputOTP ? t('sendOTP') : t('sendOTPAgain')}
                                    </Button>
                                </AnimationTran>
                            )}
                        </form>
                    </section>

                    <section className="min-h-[31rem] w-full flex-col items-center lg:flex hidden">
                        <Logo />
                        <AnimationTran tranY={-100} className="m-auto">
                            <h5 className="leading-7 tracking-tight">{t('titleForgotPass')}</h5>
                        </AnimationTran>
                        <div className="bg-forgotPassword-banner bg-contain bg-no-repeat bg-center w-full h-full"></div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ForgotPassWord;
