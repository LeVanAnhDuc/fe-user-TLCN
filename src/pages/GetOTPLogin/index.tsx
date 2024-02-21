import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import config from '../../config';
import { sendOTPRegister, verifyOTPRegister } from '../../apis/authApi';
import AnimationTran from '../../components/AnimationTran';
import logoDuck from '../../assets/img/logoDuck.png';
import SnackBarLoading from '../../components/SnackBarLoading';
import Button from '../../components/Button';

type TGetOTPLogin = {
    otp: string;
    email: string;
};

const GetOTPRegister = () => {
    const navigate = useNavigate();

    const [isLoadingDialog, setIsLoadingDiaLog] = useState(false);
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
    });

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<TGetOTPLogin>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<TGetOTPLogin> = async (data) => {
        setIsLoadingDiaLog(true);
        setTitleDialog('Đang kiếm tra OTP');
        const response = await verifyOTPRegister(data.email, data.otp);
        setIsLoadingDiaLog(false);

        if (response.status === 200) {
            toast.success(response.data);
            navigate(config.Routes.logIn);
        } else {
            toast.error(response.data.message);
        }
    };

    const handleSendOTPAgain = async () => {
        if (getValues().email !== undefined) {
            try {
                setIsLoadingDiaLog(true);
                setTitleDialog('Tiến hành gửi OTP');
                const response = await sendOTPRegister(getValues().email);
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
            toast.error('Vui lòng nhập email');
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
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                error={errors.email ? true : false}
                                                fullWidth
                                                label={'Nhập email'}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm mt-1.5">{errors.email?.message}</p>
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
                                                label={'Nhập OTP'}
                                            />
                                        )}
                                    />
                                    <p className="text-red-600 text-sm mt-1.5">{errors.otp?.message}</p>
                                </>
                            </AnimationTran>
                            <div className="grid grid-cols-2 gap-2">
                                <AnimationTran tranX={-100} delay={0.4}>
                                    <Button type="submit" className="bg-primary-500 w-full">
                                        Xác thực
                                    </Button>
                                </AnimationTran>

                                <AnimationTran tranX={-100} delay={0.3}>
                                    <Button className="border-primary-200 w-full" onClick={handleSendOTPAgain}>
                                        Gửi lại mã
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
