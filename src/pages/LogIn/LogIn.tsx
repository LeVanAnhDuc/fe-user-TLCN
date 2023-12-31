import config from '../../config';
import InputText from '../../components/InputText/InputText';
import { loginApi } from '../../apis/authApi';

import { useForm, SubmitHandler } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAppDispatch } from '../../redux/hook';
import { setInfoUser, setIsLogin } from './loginSlice';
import { getCountOfItems } from '../../apis/cartApi';
import { getWishListNumber } from '../../apis/followProductApi';
import { setToTalProductCart } from '../Cart/totalProducCartSlice';
import { setToTalWishList } from '../Profile/Wishlist/wishListSlice';

type FormData = {
    email: string;
    passWord: string;
};

const MESS_XACTHUC = 'Tài khoản chưa được xác thực';

const LogIn = () => {
    const [isLoading, setIsLoadng] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            email: '',
            passWord: '',
        },
    });
    // handle successful login
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            // chuyen qua page home
            navigate('/');
        }
    }, []);

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        const regexEmailOrUserName = /^(?=.*[A-Za-z0-9])[A-Za-z0-9@._-]{4,}$/;
        const regexPass = /^[a-zA-Z0-9]{8,}$/;
        if (!regexEmailOrUserName.test(data.email)) {
            toast.error('Email chưa đúng định dạng');
        } else if (!regexPass.test(data.passWord)) {
            toast.error('Mật khẩu phải trên 8 kí tự và không chứa kí tự đặc biệt');
        } else {
            try {
                setIsLoadng(true);
                const response = await loginApi(data.email, data.passWord);

                setIsLoadng(false);

                if (response?.data?.jwt) {
                    toast.success('Đăng nhập thành công');
                    // set redux
                    dispatch(setIsLogin(true));
                    dispatch(
                        setInfoUser({
                            userNameUser: response.data.user.username,
                            idUser: response.data.user.id,
                            avatarUrl: response.data.user.avatarUrl,
                            nameUser: response.data.user.name,
                        }),
                    );

                    getTotalItemOfCartAndTotalWishList();
                    // chuyen next page home
                    navigate('/');
                }
                // error
                if (response.data.message === MESS_XACTHUC) {
                    toast.error(response.data.message);
                    navigate(config.Routes.getOTPLogIn);
                } else {
                    if (response && response.status) {
                        toast.error(response.data.message || response.data);
                    }
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        }
    };

    // handle số lượng sản phẩm trong giỏ hàng
    const getTotalItemOfCartAndTotalWishList = async () => {
        try {
            const totalProductInCart = await getCountOfItems();
            if (totalProductInCart.status === 200) {
                dispatch(setToTalProductCart(+totalProductInCart.data));
            }
            const totalWishListt = await getWishListNumber();

            if (totalWishListt.status === 200) {
                dispatch(setToTalWishList(+totalWishListt.data));
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <>
            <Dialog onClose={() => setIsLoadng(false)} open={isLoading} fullWidth maxWidth="sm">
                <DialogTitle>Xác thực</DialogTitle>
                <DialogContent>
                    <LinearProgress color="success" />
                </DialogContent>
            </Dialog>
            <div className="m-auto pt-32">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            <strong>Đăng nhập</strong>
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mt-2">
                                <InputText
                                    labelInput="Email hoặc Tên tài khoản"
                                    errorInput={errors.email ? true : false}
                                    isRequired
                                    errorFormMessage={errors.email?.message}
                                    register={{
                                        ...register('email', {
                                            required: 'email is required',
                                        }),
                                    }}
                                    autoComplete="username"
                                />
                            </div>

                            <div className="mt-2">
                                <InputText
                                    labelInput="Mật khẩu"
                                    errorInput={errors.passWord ? true : false}
                                    isRequired
                                    typeInput="password"
                                    errorFormMessage={errors.passWord?.message}
                                    register={{
                                        ...register('passWord', {
                                            required: 'passWord is required',
                                        }),
                                    }}
                                    autoComplete="password"
                                />
                            </div>
                            <Link
                                to={config.Routes.forgotPass}
                                className="text-sm font-semibold  text-gray-600 hover:text-black float-right"
                            >
                                Quên mật khẩu
                            </Link>
                            <Button
                                style={{ background: 'black' }}
                                type="submit"
                                variant="contained"
                                fullWidth
                                color="primary"
                                size="large"
                            >
                                Đăng nhập
                            </Button>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Chưa có tài khoản?
                            <Link
                                to={config.Routes.register}
                                className="pl-1 font-semibold leading-6 text-gray-600 hover:text-black underline"
                            >
                                Đăng kí.
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogIn;
