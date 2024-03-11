import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import config from '../../config';
import { useAppDispatch } from '../../redux/hook';
import { setRegister } from './registerSlice';
import { registerApi } from '../../apis/authApi';
import AnimationScale from '../../components/AnimationScale';
import AnimationTran from '../../components/AnimationTran';
import Button from '../../components/Button';
import SnackBarLoading from '../../components/SnackBarLoading';
import Logo from '../../components/Logo';
import InputPassword from '../../components/InputPassword';

type FormDataResgister = {
    email: string;
    userName: string;
    passWord: string;
};

const Register = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation('register');

    const [isLoadingRegister, setIsLoadingRegister] = useState(false);

    const schema = yup.object().shape({
        email: yup.string().required(t('emailIsRequired')).email(t('emailIsValidate')),
        userName: yup.string().required(t('usernameIsRequired')).min(4, t('UsernameLeast4')),
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
    } = useForm<FormDataResgister>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataResgister> = async (data: FormDataResgister) => {
        try {
            setIsLoadingRegister(true);
            const response = await registerApi(data.userName, data.email, data.passWord);
            setIsLoadingRegister(false);

            if (response.status === 201) {
                dispatch(
                    setRegister({
                        email: data.email,
                        passWord: data.passWord,
                    }),
                );
                toast.success(t('registerSuccessful'));
                navigate(config.Routes.getOTPRegister);
            } else {
                toast.error(t('registerFailed'));
            }
        } catch (error) {
            toast.error(t('registerFailed'));
        }
    };

    return (
        <>
            <SnackBarLoading open={isLoadingRegister} content={t('proceedWithRegistration')} />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center dark:from-primary-700 dark:via-primary-900 dark:to-primary-800">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow dark:bg-dark-600">
                    <section className="w-full h-full flex-col lg:flex hidden">
                        <AnimationScale className="m-auto">
                            <Logo />
                        </AnimationScale>
                        <AnimationTran tranY={-100}>
                            <h5 className="leading-7 tracking-tight">{t('titleRegister')}</h5>
                        </AnimationTran>
                        <div className="bg-register-banner bg-contain bg-no-repeat bg-center w-full h-full"></div>
                    </section>
                    <section className="w-full flex flex-col justify-center gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg dark:bg-dark-400">
                        <AnimationTran tranX={-100} className="text-2xl font-bold ">
                            {t('register')}
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
                                                autoComplete="email"
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
                                        name="userName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.userName ? true : false}
                                                fullWidth
                                                label={t('enterUsername')}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                        {errors.userName?.message}
                                    </p>
                                </>
                            </AnimationTran>
                            <AnimationTran tranX={-100} delay={0.3}>
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
                            <AnimationTran tranX={-100} delay={0.4}>
                                <Button type="submit" fullWidth variant="fill" loading={isLoadingRegister}>
                                    {t('register')}
                                </Button>
                            </AnimationTran>
                        </form>

                        <AnimationTran tranY={100} delay={0.5} className="text-center text-sm ">
                            <div className="flex place-content-center place-items-center">
                                {t('alreadyAccount')}?
                                <Button variant="text" size="small" className="!px-0">
                                    <Link
                                        to={config.Routes.logIn}
                                        className="pl-1 font-semibold text-base underline transition"
                                    >
                                        {t('login')}.
                                    </Link>
                                </Button>
                            </div>
                        </AnimationTran>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Register;
