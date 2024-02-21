import TextField from '@mui/material/TextField';

import { toast } from 'react-toastify';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import config from '../../config';
import { sendOTPRegister, verifyOTPRegister } from '../../apis/authApi';
import { forgotPassWord } from '../../apis/userApi';
import logoDuck from '../../assets/img/logoDuck.png';
import SnackBarLoading from '../../components/SnackBarLoading';
import AnimationTran from '../../components/AnimationTran';
import Button from '../../components/Button';

type FormDataForgotPassword = {
    otp: string;
    email: string;
    pass: string;
    comfirmPass: string;
};

const ForgotPassWord = () => {
    const navigate = useNavigate();

    const [inputPass, setInputPass] = useState<boolean>(false);
    const [inputOTP, setInputOTP] = useState<boolean>(false);
    const [isLoadingDiaLog, setIsLoadingDiaLog] = useState(false);
    const [titleDialog, setTitleDialog] = useState<string>('');

    const schema = yup.object().shape({
        email: yup.string().required('Email đang trống').email('Định dạng email không đúng'),
        otp: yup
            .string()
            .required('OTP đang trống')
            .min(4, 'OTP phải từ 4 kí tự trở lên')
            .test('is-OTP', 'OTP không được chứa kí tự lạ', function (value) {
                if (!value) return true;

                const numericRegex = /^[a-zA-Z0-9]+$/;
                return numericRegex.test(value);
            }),
        pass: yup.string().required('Mật khẩu đang trống'),
        comfirmPass: yup.string().required('Mật khẩu đang trống'),
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
        if (!inputPass) {
            try {
                setIsLoadingDiaLog(true);
                setTitleDialog('Đang kiếm tra OTP');
                const response = await verifyOTPRegister(data.email, data.otp);
                setIsLoadingDiaLog(false);

                if (response.status === 200) {
                    toast.success(response.data);
                    setInputPass(true);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            if (data.pass === data.comfirmPass) {
                try {
                    setIsLoadingDiaLog(true);
                    setTitleDialog('Kiểm tra mật khẩu');
                    const response = await forgotPassWord(data.email, data.pass);
                    setIsLoadingDiaLog(false);

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
            } else {
                toast.error('Mật khẩu hiện chưa khớp');
            }
        }
    };

    const handleSendOTPAgain = async () => {
        setIsLoadingDiaLog(true);
        setTitleDialog('Tiến hành gửi OTP');
        const response = await sendOTPRegister(getValues().email);
        setIsLoadingDiaLog(false);

        if (response.status === 200) {
            setInputOTP(true);
            toast.success('Đã gửi OTP');
        } else {
            toast.error(response.data.message || response.data);
        }
    };
    return (
        <>
            <SnackBarLoading open={isLoadingDiaLog} content={titleDialog} />
            <div className="bg-gradient-to-r from-primary-200 via-primary-700 to-primary-500 flex place-content-center">
                <div className="w-10/12 xl:w-8/12 flex gap-3 bg-gray-100 my-20 py-8 px-6 rounded-xl shadow">
                    <section className="w-full flex flex-col justify-start gap-6 shadow py-7 px-5 bg-gray-50 rounded-lg">
                        <AnimationTran tranX={100} className="text-2xl font-bold text-gray-900">
                            Quên mật khẩu
                        </AnimationTran>
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                                                label={'Nhập email'}
                                                autoComplete="email"
                                                disabled={inputOTP ? true : false}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm mt-1.5">{errors.email?.message}</p>
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
                                                    label={'Nhập OTP'}
                                                    disabled={inputPass ? true : false}
                                                />
                                            )}
                                        />
                                        <p className="text-red-600 text-sm mt-1.5">{errors.otp?.message}</p>
                                    </>
                                </AnimationTran>
                            )}
                            {inputPass && (
                                <>
                                    <AnimationTran tranY={-100}>
                                        <>
                                            <Controller
                                                name="pass"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        error={errors.pass ? true : false}
                                                        fullWidth
                                                        label={'Nhập mật khẩu'}
                                                    />
                                                )}
                                            />
                                            <p className="text-red-600 text-sm mt-1.5">{errors.pass?.message}</p>
                                        </>
                                    </AnimationTran>
                                    <AnimationTran tranY={-100} delay={0.1}>
                                        <>
                                            <Controller
                                                name="comfirmPass"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        error={errors.comfirmPass ? true : false}
                                                        fullWidth
                                                        label={'Nhập lại mật khẩu'}
                                                    />
                                                )}
                                            />
                                            <p className="text-red-600 text-sm mt-1.5">{errors.comfirmPass?.message}</p>
                                        </>
                                    </AnimationTran>
                                </>
                            )}
                            {inputOTP && (
                                <AnimationTran tranY={-100} delay={0.1}>
                                    <Button type="submit" className="bg-primary-500 w-full">
                                        {inputPass ? 'Xác nhận mật khẩu mới' : 'Xác thực OTP'}
                                    </Button>
                                </AnimationTran>
                            )}
                            {!inputPass && (
                                <AnimationTran tranX={100} delay={0.3}>
                                    <Button className="border-primary-200 w-full" onClick={handleSendOTPAgain}>
                                        {!inputOTP ? 'Gửi mã OTP' : 'Gửi lại mã OTP'}
                                    </Button>
                                </AnimationTran>
                            )}
                        </form>
                    </section>

                    <section className="min-h-[31rem] w-full flex-col lg:flex hidden">
                        <Link to={config.Routes.home}>
                            <img src={logoDuck} alt="Logo_Duck" className="h-20 m-auto" />
                        </Link>
                        <AnimationTran tranY={-100} className="m-auto">
                            <h5 className="leading-7 tracking-tight">
                                Đừng lo lắng khi quên mật khẩu. Chỉ cần thực hiện các bước sau để có thể đổi mật khẩu
                                của bạn.
                            </h5>
                        </AnimationTran>
                        <div className="bg-forgotPassword-banner bg-contain bg-no-repeat bg-center w-full h-full"></div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ForgotPassWord;
