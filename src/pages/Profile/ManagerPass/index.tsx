import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { changePassWordByToken } from '../../../apis/userApi';
import InputPassword from '../../../components/InputPassword';
import Button from '../../../components/Button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IFormPassWord {
    currentPassWord: string;
    newPassWord: string;
    confirmPassWord: string;
}

const ManagerPass = () => {
    const { t } = useTranslation('passWordProfile');
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);

    const schema = yup.object().shape({
        currentPassWord: yup.string().required(t('passwordIsRequired')).min(8, t('passwordLeast8')),
        newPassWord: yup
            .string()
            .required(t('passwordIsRequired'))
            .min(8, t('passwordLeast8'))
            .notOneOf([yup.ref('currentPassWord'), null], t('newPasswordNoRepeat')),
        confirmPassWord: yup
            .string()
            .required(t('passwordIsRequired'))
            .min(8, t('passwordLeast8'))
            .oneOf([yup.ref('newPassWord')], t('confirmPasswordNoRepeat')),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormPassWord>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<IFormPassWord> = async (data) => {
        try {
            setLoadingAPI(true);
            const response = await changePassWordByToken(data.currentPassWord, data.newPassWord);
            setLoadingAPI(false);

            if (response.status === 200) {
                toast.success(t('updateSuccessful'));
            } else {
                toast.error(response?.data.message || response?.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <section className="bg-white p-7 rounded-lg dark:bg-dark-600">
            <div className="h-full lg:w-9/12 xl:w-7/12 m-auto space-y-5">
                <div className="font-bold text-xl text-center">{t('changePass')}</div>
                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Controller
                            name="currentPassWord"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputPassword
                                    field={{ ...field }}
                                    error={errors.currentPassWord ? true : false}
                                    label={t('enterPasswordCurrent')}
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                            {errors.currentPassWord?.message}
                        </p>
                    </div>
                    <div>
                        <Controller
                            name="newPassWord"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputPassword
                                    field={{ ...field }}
                                    error={errors.newPassWord ? true : false}
                                    label={t('enterNewPassword')}
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.newPassWord?.message}</p>
                    </div>
                    <div>
                        <Controller
                            name="confirmPassWord"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <InputPassword
                                    field={{ ...field }}
                                    error={errors.confirmPassWord ? true : false}
                                    label={t('enterConfirmNewPassword')}
                                />
                            )}
                        />
                        <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                            {errors.confirmPassWord?.message}
                        </p>
                    </div>
                    <Button type="submit" variant="fill" fullWidth loading={isLoadingAPI}>
                        {t('savePass')}
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default ManagerPass;
