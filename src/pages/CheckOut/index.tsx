import Checkbox from '@mui/material/Checkbox';
import { useCallback, useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { setItemsOfCart, setToTalProductCart } from '../Cart/cartSlice';
import config from '../../config';
import { IOrderCheckOut } from '../../interface/order';
import IAddress from '../../interface/address';
import { getListAddressOffCurrentUser } from '../../apis/addressApi';
import { getTotalPriceForYourCart } from '../../apis/cartApi';
import { addOrderByToken, getOrderByID, makePaymentAgainByToken } from '../../apis/orderApi';
import imgVNPAY from '../../assets/img/VnPay.png';
import { checkOutVNPay, makePaymentVNPay } from '../../apis/vnpayApi';
import TextField from '@mui/material/TextField';
import Button from '../../components/Button';
import { convertNumberToVND } from '../../utils/convertData';
import AnimationScale from '../../components/AnimationScale';
import AnimationTran from '../../components/AnimationTran';

const Pay = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const idOrder = location.state.idOder;

    const [isChecked, setIsChecked] = useState(false);
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const schema = yup.object().shape({
        paymentType: yup.string().required('Hình thức thanh toán đang trống'),
        addressId: yup.number().required('Địa chỉ đang trống'),
        note: yup.string(),
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IOrderCheckOut>({
        resolver: yupResolver(schema),
    });

    const handleCheckboxChange = useCallback(
        (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
            setIsChecked(event.target.checked);
        },
        [],
    );

    const getAddressesAndTotalPrice = async () => {
        try {
            const [addressesAPI, totalPriceAPI] = await Promise.all([
                getListAddressOffCurrentUser(),
                getTotalPriceForYourCart(),
            ]);

            if (addressesAPI.status === 200) {
                if (addressesAPI?.data) {
                    setAddresses(addressesAPI.data);
                }
            }
            if (totalPriceAPI.status === 200) {
                setTotalPrice(totalPriceAPI?.data);
            }
        } catch (error) {
            console.log(`${error}`);
        }
    };

    const getAddressesAndOrderForWaiting = async () => {
        const [addressesAPI, OrderByIDAPI] = await Promise.all([
            getListAddressOffCurrentUser(),
            getOrderByID(+idOrder),
        ]);

        if (addressesAPI.status === 200) {
            if (addressesAPI?.data) {
                setAddresses(addressesAPI.data);
            }
        }
        if (OrderByIDAPI.status === 200) {
            setTotalPrice(OrderByIDAPI.data.total);
            setValue('addressId', OrderByIDAPI.data.address.id);
            setValue('note', OrderByIDAPI.data.note);
            setValue('paymentType', OrderByIDAPI.data.paymentType);
        }
        console.log(OrderByIDAPI);
    };

    const onSubmit: SubmitHandler<IOrderCheckOut> = async (data) => {
        let PaymentType: string = '';

        if (data.paymentType === config.PaymentType.CashOnDelivery) {
            PaymentType = 'COD';
            try {
                if (idOrder) {
                    const response = await makePaymentAgainByToken(+idOrder, {
                        total: totalPrice,
                        paymentType: PaymentType,
                        note: data.note,
                        addressId: data.addressId,
                    });

                    if (response?.status === 200) {
                        toast.success('Đặt hàng thành công');
                        navigate(config.Routes.detailOrder + '#' + response.data.id);
                    } else {
                        toast.error(response?.data.message || response?.data);
                    }
                } else {
                    const response = await addOrderByToken({
                        total: totalPrice,
                        paymentType: PaymentType,
                        note: data.note,
                        addressId: data.addressId,
                    });

                    if (response?.status === 201) {
                        dispatch(setToTalProductCart(0));
                        dispatch(setItemsOfCart([]));
                        toast.success('Đặt hàng thành công');
                        navigate(config.Routes.detailOrder + '#' + response.data.id);
                    } else {
                        toast.error(response?.data.message || response?.data);
                    }
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            PaymentType = 'VN_PAY';
            const savedInfoUser = localStorage.getItem('infoUser');
            let userName: string = '';
            if (savedInfoUser) {
                const dataInfo: { userNameUser: string } = JSON.parse(savedInfoUser);
                userName = dataInfo.userNameUser;
            }
            try {
                if (idOrder) {
                    const redirectURL = makePaymentVNPay(totalPrice, +idOrder, data.addressId, data.note);
                    window.location.href = redirectURL;
                } else {
                    dispatch(setToTalProductCart(0));
                    dispatch(setItemsOfCart([]));
                    const redirectURL = checkOutVNPay(
                        {
                            total: totalPrice,
                            paymentType: PaymentType,
                            note: data.note,
                            addressId: data.addressId,
                        },
                        userName,
                    );
                    window.location.href = redirectURL;
                }
            } catch (error) {
                toast.error(`${error}`);
            }
        }
    };

    useEffect(() => {
        if (idOrder) {
            getAddressesAndOrderForWaiting();
        } else {
            getAddressesAndTotalPrice();
        }
    }, []);

    return (
        <section className="bg-gray-100 py-5 sm:py-10 ">
            <div className="sm:w-10/12 w-11/12 m-auto flex justify-center">
                <div className="grid lg:grid-cols-5 gap-10">
                    <div className="space-y-3 lg:col-span-3 bg-white p-5 sm:p-10 rounded-lg">
                        <div className="font-semibold text-xl">Thông tin liên lạc của bạn ?</div>
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <AnimationTran tranY={100}>
                                <Controller
                                    name="paymentType"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel>Hình thức thanh toán</InputLabel>
                                            <Select
                                                {...field}
                                                input={<OutlinedInput label="Hình thức thanh toán" />}
                                                error={errors.paymentType ? true : false}
                                            >
                                                <MenuItem value={config.PaymentType.VNPay} sx={{ height: '50px' }}>
                                                    <div className="w-full flex justify-between items-center">
                                                        {config.PaymentType.VNPay}
                                                        <Avatar
                                                            src={imgVNPAY}
                                                            sx={{
                                                                height: '100%',
                                                                width: '70px',
                                                            }}
                                                            variant="rounded"
                                                        />
                                                    </div>
                                                </MenuItem>
                                                <MenuItem
                                                    value={config.PaymentType.CashOnDelivery}
                                                    sx={{ height: '50px' }}
                                                >
                                                    {config.PaymentType.CashOnDelivery}
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <p className="text-red-600 text-sm mt-1.5">{errors.paymentType?.message}</p>
                            </AnimationTran>

                            {addresses.length > 0 ? (
                                <AnimationTran tranY={100} delay={0.05}>
                                    <Controller
                                        name="addressId"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel>Địa chỉ</InputLabel>
                                                <Select
                                                    {...field}
                                                    input={<OutlinedInput label="Địa chỉ" />}
                                                    fullWidth
                                                    error={errors.addressId ? true : false}
                                                >
                                                    {addresses.map((item, index) => (
                                                        <MenuItem value={item.id} key={index}>
                                                            <div className="text-sm">
                                                                <div>{item.fullName}</div>
                                                                <div>{item.phoneNumber}</div>
                                                                <div>
                                                                    {item.orderDetails}, {item.ward}, {item.district},{' '}
                                                                    {item.city}
                                                                </div>
                                                            </div>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                    <p className="text-red-600 text-sm mt-1.5">{errors.addressId?.message}</p>
                                </AnimationTran>
                            ) : (
                                <Link to={config.Routes.profileAddressProfile}>
                                    <Button fullWidth variant="outline">
                                        Hiện chưa có địa chỉ. Nhấn để thêm
                                    </Button>
                                </Link>
                            )}

                            <AnimationTran tranY={100} delay={0.1}>
                                <Controller
                                    name="note"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.note ? true : false}
                                            fullWidth
                                            multiline
                                            rows={9}
                                            placeholder={'Nhập ghi chú'}
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm mt-1.5">{errors.note?.message}</p>
                            </AnimationTran>

                            <AnimationScale scale={0.4}>
                                <Button type="submit" variant="fill" fullWidth disabled={!isChecked}>
                                    Đặt hàng
                                </Button>
                            </AnimationScale>

                            <div className="grid grid-cols-10">
                                <span>
                                    <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                                </span>
                                <span className="col-span-9 text-gray-400">
                                    Tôi đã đọc và đồng ý cho Duck xử lý thông tin của tôi theo
                                    <span className="underline ml-0.5">Quy định về Quyền riêng tư</span> và
                                    <span className="underline ml-0.5"> Chính sách Cookie </span>. Duck là đối tác tin
                                    cậy của Duck.
                                </span>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-5 lg:col-span-2 bg-white h-fit p-5 sm:p-10 rounded-lg sticky top-20">
                        <h1 className="text-xl font-bold text-center">Tổng chi phí</h1>
                        <div className="flex justify-between">
                            <span className="font-medium">Tổng tiền</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                {convertNumberToVND(totalPrice)}
                                <span className="text-sm">đ</span>
                            </AnimationScale>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Phí vận chuyển</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                {convertNumberToVND(0)}
                                <span className="text-sm">đ</span>
                            </AnimationScale>
                        </div>
                        <div className="h-0.5 bg-gray-200 w-full"></div>

                        <div className="flex justify-between relative">
                            <span className="font-medium">Thành tiền</span>
                            <AnimationScale scale={0.1} className="flex justify-end gap-1 text-red-500 font-medium">
                                {convertNumberToVND(totalPrice)}
                                <span className="text-sm">đ</span>
                            </AnimationScale>
                        </div>

                        <div className="h-0.5 bg-gray-200 w-full"></div>

                        <div className="text-center text-gray-600">
                            (Tổng cộng giá của đơn hàng của bạn, bao gồm tất cả các chi phí và thuế)
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pay;
