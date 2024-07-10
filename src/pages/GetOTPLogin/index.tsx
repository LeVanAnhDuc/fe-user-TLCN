// libs
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
// components
import AnimationTran from '@/components/AnimationTran';
import SnackBarLoading from '@/components/SnackBarLoading';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
// apis
import { sendOTPRegister, verifyOTPRegister } from '@/apis/authApi';
// others
import config from '@/config';

type FormDataGetOTPLogin = {
    otp: string;
    email: string;
};

const GetOTPRegister = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('getOTPLogin');

    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [isLoadingSendOTPAgain, setIsLoadingSendOTPAgain] = useState(false);
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
    });

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormDataGetOTPLogin>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataGetOTPLogin> = async (data) => {
        try {
            setIsLoadingSubmit(true);
            setTitleDialog(t('proceedWithCheckOTP'));
            const response = await verifyOTPRegister(data.email, data.otp);
            setIsLoadingSubmit(false);

            if (response.status === 200) {
                toast.success(response.data);
                navigate(config.Routes.logIn);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSendOTPAgain = async () => {
        if (getValues().email !== undefined) {
            try {
                setIsLoadingSendOTPAgain(true);
                setTitleDialog(t('proceedWithSendOTP'));
                const response = await sendOTPRegister(getValues().email);
                setIsLoadingSendOTPAgain(false);

                if (response.status === 200) {
                    toast.success(response.data);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.error(t('pleaseEnterEmail'));
        }
    };
    return (
        <>
            <SnackBarLoading open={isLoadingSendOTPAgain || isLoadingSubmit} content={titleDialog} />
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
                        <AnimationTran tranX={-100} className="text-2xl font-bold">
                            {t('enterAuthCode')}
                        </AnimationTran>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <AnimationTran tranX={-100} delay={0.1}>
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
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.email?.message}
                                    </p>
                                </>
                            </AnimationTran>
                            <AnimationTran tranX={-100} delay={0.2}>
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
                                <AnimationTran tranX={-100} delay={0.4}>
                                    <Button type="submit" variant="fill" fullWidth loading={isLoadingSubmit}>
                                        {t('otpAuthentication')}
                                    </Button>
                                </AnimationTran>

                                <AnimationTran tranX={-100} delay={0.3}>
                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={handleSendOTPAgain}
                                        loading={isLoadingSendOTPAgain}
                                    >
                                        {t('sendOTPAgain')}
                                    </Button>
                                </AnimationTran>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </>
    );
};

export default GetOTPRegister;
