// libs
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// components
import AnimationScale from '@/components/AnimationScale';
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import SnackBarLoading from '@/components/SnackBarLoading';
import Logo from '@/components/Logo';
import Form from './mains/Form';
// others
import config from '@/config';

const Register = () => {
    const { t } = useTranslation('register');

    const [isLoadingRegister, setIsLoadingRegister] = useState<boolean>(false);

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

                        <Form {...{ setIsLoadingRegister, isLoadingRegister }} />

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
