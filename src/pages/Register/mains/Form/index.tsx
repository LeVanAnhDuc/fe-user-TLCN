// libs
import TextField from '@mui/material/TextField';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
// components
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import InputPassword from '@/components/InputPassword';
// apis
import { registerApi } from '@/apis/authApi';
// redux
import { useAppDispatch } from '@/redux/hook';
// others
import config from '@/config';
import { setRegister } from '../../registerSlice';

interface FormDataRegister {
    email: string;
    userName: string;
    passWord: string;
}

const Form = ({
    setIsLoadingRegister,
    isLoadingRegister,
}: {
    setIsLoadingRegister: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingRegister: boolean;
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation('register');

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
    } = useForm<FormDataRegister>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataRegister> = async (data: FormDataRegister) => {
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
                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.email?.message}</p>
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
                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.userName?.message}</p>
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
                    <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.passWord?.message}</p>
                </>
            </AnimationTran>
            <AnimationTran tranX={-100} delay={0.4}>
                <Button type="submit" fullWidth variant="fill" loading={isLoadingRegister}>
                    {t('register')}
                </Button>
            </AnimationTran>
        </form>
    );
};

export default Form;
