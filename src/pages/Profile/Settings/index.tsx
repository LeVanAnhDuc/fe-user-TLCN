import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import config from '../../../config';
import { IInfoProfileUser } from '../../../interface/user';
import { getUserByUserNameOrEmail, updateAccountProfileOfSignedinAccount } from '../../../apis/userApi';
import Button from '../../../components/Button';
import TextField from '@mui/material/TextField';
import Error404 from '../../Error404';
import Loading from '../../../components/Loading';
import { useDispatch } from 'react-redux';
import { setNameUser } from '../../LogIn/loginSlice';
import { objectsAreEqual } from '../../../utils/checkData';

interface FormData extends Pick<IInfoProfileUser, 'username' | 'name' | 'email' | 'phoneNumber' | 'gender'> {}

const Settings = () => {
    const dispatch = useDispatch();
    const savedInfoUser = localStorage.getItem('infoUser');

    const [firstLoadingAPIGet, setFirstLoadingAPIGet] = useState<boolean>(true);
    const [isLoadingAPIGet, setLoadingAPIGet] = useState<boolean>(false);
    const [isLoadingAPIUpdate, setLoadingAPIUpdate] = useState<boolean>(false);
    const [info, setInfo] = useState<IInfoProfileUser>();
    const [errorAPI, setErrorAPI] = useState<boolean>(false);

    const schema = yup.object().shape({
        username: yup.string().required('Tên tài khoản đang trống'),
        name: yup.string().required('Tên đang trống'),
        email: yup.string().required('Email đang trống').email('Định dạng email không đúng'),
        phoneNumber: yup
            .string()
            .required('Số điện thoại đang trống')
            .test('checkNumber', 'Số điện thoại không hợp lệ', (value) => {
                const regex = /^[0-9]+$/;
                return regex.test(value);
            })
            .min(10, 'Mật khẩu phải từ 10 kí tự trở lên')
            .max(11, 'Mật khẩu phải từ 11 kí tự trở xuống'),
        gender: yup.string().required('Giới tính đang trống'),
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const handlegetInfoUser = async () => {
        if (savedInfoUser) {
            const dataInfo = JSON.parse(savedInfoUser);
            try {
                firstLoadingAPIGet && setLoadingAPIGet(true);

                const [response] = await Promise.all([
                    getUserByUserNameOrEmail(dataInfo.userNameUser),
                    firstLoadingAPIGet && new Promise((resolve) => setTimeout(resolve, 250)),
                ]);

                firstLoadingAPIGet && setLoadingAPIGet(false);

                if (response.status === 200) {
                    setFirstLoadingAPIGet(false);

                    await setValue('username', response.data.username);
                    await setValue('name', response.data.name);
                    await setValue('email', response.data.email);
                    await setValue('phoneNumber', response.data.phoneNumber);
                    await setValue('gender', response.data.gender);
                    setInfo({
                        username: response.data.username,
                        name: response.data.name,
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber,
                        gender: response.data.gender,
                        avatarUrl: '',
                    });
                } else {
                    setErrorAPI(true);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        }
    };
    useEffect(() => {
        handlegetInfoUser();
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const dataProfile: IInfoProfileUser = {
            username: data.username.trim(),
            name: data.name.trim(),
            email: data.email.trim(),
            phoneNumber: data.phoneNumber.trim(),
            gender: data.gender,
            avatarUrl: '',
        };
        if (info && objectsAreEqual(info, dataProfile)) {
            return;
        }

        setLoadingAPIUpdate(true);
        const response = await updateAccountProfileOfSignedinAccount(dataProfile);
        setLoadingAPIUpdate(false);

        if (response.status === 200) {
            setInfo(dataProfile);
            dispatch(setNameUser(data.name));
            toast.success('Cập nhật thông tin thành công');
        } else {
            toast.error(response.data.message || response.data.phoneNumber);
        }
    };

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            {isLoadingAPIGet ? (
                <Loading />
            ) : (
                <section className="bg-white p-7 rounded-lg">
                    <div className="space-y-5 lg:w-9/12 xl:w-7/12 m-auto">
                        <div className="font-bold text-xl text-center">Thông tin cá nhân</div>
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
                                            label={'Tên tài khoản'}
                                            autoComplete="username"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.username?.message}
                                </p>
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
                                            label={'Nhập tên của bạn'}
                                            autoComplete="name"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.name?.message}
                                </p>
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
                                            label={'Nhập email'}
                                            autoComplete="email"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.email?.message}
                                </p>
                            </div>
                            <div>
                                <Controller
                                    name="gender"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>Giới tính</InputLabel>
                                            <Select
                                                {...field}
                                                fullWidth
                                                error={errors.gender ? true : false}
                                                label="Giới tính"
                                            >
                                                <MenuItem value={config.Gender.NAM}>{config.Gender.NAM}</MenuItem>
                                                <MenuItem value={config.Gender.NU}>{config.Gender.NU}</MenuItem>
                                                <MenuItem value={config.Gender.ORTHER}>{config.Gender.ORTHER}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.gender?.message}
                                </p>
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
                                            label={'Nhập số điện thoại'}
                                            autoComplete="phone"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm py-1 h-6 dark:text-red-500">
                                    {errors.phoneNumber?.message}
                                </p>
                            </div>

                            <Button type="submit" variant="fill" fullWidth loading={isLoadingAPIUpdate}>
                                Cập nhật
                            </Button>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
};

export default Settings;
