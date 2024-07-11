// libs
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
// types
import { IUserInfoUpdate } from '@/types/user';
// components
import Button from '@/components/Button';
// apis
import { updateAccountProfileOfSignedinAccount } from '@/apis/userApi';
// redux
import { useDispatch } from 'react-redux';
import { setNameUser } from '@/pages/LogIn/loginSlice';
// others
import config from '@/config';
import { objectsAreEqual } from '@/utils/checkData';

const Form = ({
    user,
    setUser,
    setLoadingAPIUpdate,
    isLoadingAPIUpdate,
}: {
    user?: IUserInfoUpdate;
    setUser: React.Dispatch<React.SetStateAction<IUserInfoUpdate | undefined>>;
    isLoadingAPIUpdate: boolean;
    setLoadingAPIUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('accountProfile');

    const schema = yup.object().shape({
        username: yup.string().required(t('usernameIsRequired')).min(4, t('UsernameLeast4')),
        name: yup.string().required(t('nameIsRequired')),
        email: yup.string().required(t('emailIsRequired')).email(t('emailIsValidate')),
        phoneNumber: yup
            .string()
            .required(t('phoneIsRequired'))
            .test('checkNumber', t('phoneIsNotFormat'), (value) => {
                const regex = /^[0-9]+$/;
                return regex.test(value);
            })
            .min(10, t('phoneLeast10'))
            .max(11, t('phoneLess11')),
        gender: yup.string().required(t('genderIsRequired')),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IUserInfoUpdate>({
        resolver: yupResolver(schema),
        defaultValues: user,
    });

    const onSubmit: SubmitHandler<IUserInfoUpdate> = async (data) => {
        const dataProfile: IUserInfoUpdate = {
            username: data.username.trim(),
            name: data.name.trim(),
            email: data.email.trim(),
            phoneNumber: data.phoneNumber.trim(),
            gender: data.gender,
        };
        if (user && objectsAreEqual(user, dataProfile)) {
            toast.warning(t('noneUpdate'));
            return;
        }

        setLoadingAPIUpdate(true);
        const response = await updateAccountProfileOfSignedinAccount({ ...dataProfile, avatarUrl: '' });
        setLoadingAPIUpdate(false);

        if (response.status === 200) {
            setUser(dataProfile);
            dispatch(setNameUser(data.name));
            toast.success(t('updateSuccessful'));
        } else {
            toast.error(response.data.message || response.data.phoneNumber);
        }
    };

    return (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            variant="filled"
                            error={errors.username ? true : false}
                            fullWidth
                            label={t('username')}
                            autoComplete="username"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )}
                />
                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.username?.message}</p>
            </div>
            <div>
                <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            error={errors.name ? true : false}
                            fullWidth
                            label={t('enterName')}
                            autoComplete="name"
                        />
                    )}
                />
                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.name?.message}</p>
            </div>
            <div>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
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
            </div>
            <div>
                <Controller
                    name="gender"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel>{t('selectGender')}</InputLabel>
                            <Select {...field} fullWidth error={errors.gender ? true : false} label={t('selectGender')}>
                                <MenuItem value={config.Gender.NAM}>{t('men')}</MenuItem>
                                <MenuItem value={config.Gender.NU}>{t('women')}</MenuItem>
                                <MenuItem value={config.Gender.OTHER}>{t('other')}</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />
                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.gender?.message}</p>
            </div>
            <div>
                <Controller
                    name="phoneNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            error={errors.phoneNumber ? true : false}
                            fullWidth
                            label={t('enterPhone')}
                            autoComplete="phone"
                        />
                    )}
                />
                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">{errors.phoneNumber?.message}</p>
            </div>

            <Button type="submit" variant="fill" fullWidth loading={isLoadingAPIUpdate}>
                {t('update')}
            </Button>
        </form>
    );
};

export default Form;
