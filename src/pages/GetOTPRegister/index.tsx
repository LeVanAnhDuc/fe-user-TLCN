import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

import { useAppSelector } from '../../redux/hook';
import { clearRegister, getDataRegister } from '../Register/registerSlice';
import { loginApi, sendOTPRegister, verifyOTPRegister } from '../../apis/authApi';
import { useAppDispatch } from '../../redux/hook';
import { setInfoUser, setIsLogin } from '../LogIn/loginSlice';
import config from '../../config';
import logoDuck from '../../assets/img/logoDuck.png';
import AnimationTran from '../../components/AnimationTran';
import Button from '../../components/Button';
import SnackBarLoading from '../../components/SnackBarLoading';

type FormDataGetOTPRegister = {
    otp: string;
};

const GetOTPRegister = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const dataRegister = useAppSelector(getDataRegister);

    const [isLoadingDialog, setIsLoadingDiaLog] = useState(false);
    const [titleDialog, setTitleDialog] = useState<string>('');
    const [verifyOTP, setVerifyOTP] = useState<boolean>(false);

    const schema = yup.object().shape({
        otp: yup
            .string()
            .required('OTP đang trống')
            .min(4, 'OTP phải từ 4 kí tự trở lên')
            .test('is-OTP', 'OTP không được chứa kí tự lạ', function (value) {
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
        if (dataRegister.email !== '') {
            try {
                setIsLoadingDiaLog(true);
                setTitleDialog('Đang kiếm tra OTP');
                const response = await verifyOTPRegister(dataRegister.email, data.otp);
                setIsLoadingDiaLog(false);

                if (response.status === 200) {
                    toast.success(response.data);
                    setVerifyOTP(true);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.error('OTP của email hết hạn. Vui lòng nhập lại Email');
            navigate(config.Routes.getOTPLogIn);
            setVerifyOTP(false);
        }
    };

    const handleSendOTPAgain = async () => {
        if (dataRegister.email !== '') {
            try {
                setIsLoadingDiaLog(true);
                setTitleDialog('Tiến hành gửi OTP');
                const response = await sendOTPRegister(dataRegister.email);
                setIsLoadingDiaLog(false);

                if (response.status === 200) {
                    toast.success(response.data);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.error('OTP của email hết hạn. Vui lòng nhập lại Email');
            navigate(config.Routes.getOTPLogIn);
            setVerifyOTP(false);
        }
    };

    const handleLogin = async () => {
        try {
            setIsLoadingDiaLog(true);
            setTitleDialog('Tiến hành đăng nhập');
            const response = await loginApi(dataRegister.email, dataRegister.passWord);
            setIsLoadingDiaLog(false);

            if (response.status === 200 && response.data.jwt) {
                toast.success('Đăng nhập thành công');
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
                navigate('/');
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };
    return (
        <>
            <SnackBarLoading open={isLoadingDialog} content={titleDialog} />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow">
                    <section className="min-h-[31rem] w-full flex-col lg:flex hidden">
                        <Link to={config.Routes.home}>
                            <img src={logoDuck} alt="Logo_Duck" className="h-20 m-auto" />
                        </Link>
                        <AnimationTran tranY={-100} className="m-auto">
                            <h5 className="leading-7 tracking-tight">Mã xác thực sẽ được gửi qua Email</h5>
                        </AnimationTran>
                        <div className="bg-register-banner bg-contain bg-no-repeat bg-center w-full h-full"></div>
                    </section>

                    <section className="w-full flex flex-col justify-center gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg">
                        <AnimationTran tranX={-100} className="text-2xl font-bold text-gray-900">
                            Nhập mã xác thực
                        </AnimationTran>
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                                                label={'Nhập OTP'}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm mt-1.5">{errors.otp?.message}</p>
                                </>
                            </AnimationTran>
                            <div className="grid grid-cols-2 gap-2">
                                <AnimationTran tranX={-100} delay={0.3}>
                                    <Button type="submit" className="bg-primary-500 w-full">
                                        Xác thực OTP
                                    </Button>
                                </AnimationTran>
                                <AnimationTran tranX={-100} delay={0.2}>
                                    <Button
                                        type="submit"
                                        className="bg-primary-500 w-full"
                                        disabled={verifyOTP ? false : true}
                                        onClick={handleLogin}
                                    >
                                        Đăng nhập ngay
                                    </Button>
                                </AnimationTran>
                            </div>
                            <AnimationTran tranX={-100} delay={0.4}>
                                <Button className="bg-primary-500 w-full" onClick={handleSendOTPAgain}>
                                    Gửi lại mã
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
