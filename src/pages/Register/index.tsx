import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

import config from '../../config';
import { useAppDispatch } from '../../redux/hook';
import { setRegister } from './registerSlice';
import { registerApi } from '../../apis/authApi';
import AnimationScale from '../../components/AnimationScale';
import AnimationTran from '../../components/AnimationTran';
import Button from '../../components/Button';
import { checkPassWord } from '../../utils/checkData';
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

    const [isLoadingRegister, setIsLoadingRegister] = useState(false);

    const schema = yup.object().shape({
        email: yup.string().required('Email đang trống').email('Định dạng email không đúng'),
        userName: yup.string().required('Tên tài khoản đang trống').min(4, 'Tên tài khoản phải từ 4 kí tự trở lên'),
        passWord: yup.string().required('Mật khẩu đang trống').min(8, 'Mật khẩu phải từ 8 kí tự trở lên'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataResgister>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormDataResgister> = async (data: FormDataResgister) => {
        if (!checkPassWord(data.passWord)) {
            toast.error('Mật khẩu không chứa kí tự đặc biệt');
            return;
        }

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
                toast.success(response.data);
                navigate(config.Routes.getOTPRegister);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <>
            <SnackBarLoading open={isLoadingRegister} content="Tiến hành đăng kí. Đợi giây lát" />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center dark:from-primary-700 dark:via-primary-900 dark:to-primary-800">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow dark:bg-dark-600">
                    <section className="w-full h-full flex-col lg:flex hidden">
                        <AnimationScale className="m-auto">
                            <Logo />
                        </AnimationScale>
                        <AnimationTran tranY={-100}>
                            <h5 className="leading-7 tracking-tight">
                                Tạo hồ sơ Thành viên Duck của bạn và có quyền truy cập đầu tiên vào những sản phẩm,
                                nguồn cảm hứng và cộng đồng tốt nhất của Duck.
                            </h5>
                        </AnimationTran>
                        <div className="bg-register-banner bg-contain bg-no-repeat bg-center w-full h-full"></div>
                    </section>
                    <section className="w-full flex flex-col justify-center gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg dark:bg-dark-400">
                        <AnimationTran tranX={-100} className="text-2xl font-bold ">
                            Đăng kí
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
                                                label={'Nhập email'}
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
                                                label={'Nhập tên tài khoản'}
                                                autoComplete="name"
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
                                                label={'Nhập mật khẩu'}
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
                                    Đăng kí
                                </Button>
                            </AnimationTran>
                        </form>

                        <AnimationTran tranY={100} delay={0.5} className="text-center text-sm ">
                            <div className="flex place-content-center place-items-center">
                                Bạn đã có tài khoản?
                                <Button variant="text" size="small" className="!px-0">
                                    <Link
                                        to={config.Routes.logIn}
                                        className="pl-1 font-semibold text-base underline transition"
                                    >
                                        Đăng nhập.
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
