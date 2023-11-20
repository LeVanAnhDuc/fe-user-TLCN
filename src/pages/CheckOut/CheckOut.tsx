import { useForm, SubmitHandler } from 'react-hook-form';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { toast } from 'react-toastify';

import config from '../../config';
import Textarea from '../../components/Textarea/Textarea';
import { IOrderCheckOut } from '../../interface/order';
import IAddress from '../../interface/address';
import { getListAddressOffCurrentUser } from '../../apis/addressApi';
import { getTotalPriceForYourCart } from '../../apis/cartApi';
import { addOrderByToken } from '../../apis/orderApi';
import { useDispatch } from 'react-redux';
import { setToTalProductCart } from '../Cart/totalProducCartSlice';
import { useNavigate } from 'react-router-dom';

const Pay = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IOrderCheckOut>({});

    // check
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setIsChecked(event.target.checked);
    };
    // handle get list address
    const [listAddress, setListAddress] = useState<Array<IAddress>>([]);

    const getListAddress = async () => {
        const response = await getListAddressOffCurrentUser();

        if (response.status === 200) {
            if (response?.data) {
                setListAddress(response.data);
            }
        } else {
            toast.error(response.data.message);
        }
    };

    // handle get total price
    const [totalPrice, setTotalPrice] = useState<number>(0);

    const getListProduct = async () => {
        const response = await getTotalPriceForYourCart();

        if (response.status === 200) {
            setTotalPrice(response?.data);
        } else {
            toast.error(response?.data?.message || response?.data);
        }
    };
    useEffect(() => {
        getListAddress();
        getListProduct();
    }, []);

    // submit form
    const onSubmit: SubmitHandler<IOrderCheckOut> = async (data) => {
        //
        let PaymentType: string = '';

        if (data.paymentType === config.PaymentType.CashOnDelivery) {
            PaymentType = 'COD';
            const response = await addOrderByToken({
                total: totalPrice,
                paymentType: PaymentType,
                note: data.note,
                addressId: data.addressId,
            });
            if (response?.status === 201) {
                dispatch(setToTalProductCart(0));
                toast.success('Đặt hàng thành công');
                navigate(config.Routes.profile + '#' + config.PageInProfile.historyPaymentProfile);
            } else {
                toast.error(response?.data.message || response?.data);
            }
        } else {
            PaymentType = 'VN_PAY';
            const note = encodeURIComponent(data.note);
            const total = totalPrice;
            const addressId = data.addressId;
            const savedInfoUser = localStorage.getItem('infoUser');
            let useName: string = ''; // lấy tên username
            if (savedInfoUser) {
                const dataInfo: { userName: string } = JSON.parse(savedInfoUser);
                useName = dataInfo.userName;
            }
            dispatch(setToTalProductCart(0));
            const redirectURL = `http://localhost:8080/api/v1/vnpay/submit-order?amount=${total}&username=${useName}&addressId=${addressId}&note=${note}`;

            window.open(redirectURL, '_blank');
        }
    };
    return (
        <div className="w-10/12 m-auto pt-32">
            <div className="grid sm:grid-cols-2 gap-10 sm:grid-row-2 lg:gap-20">
                {/* start infomation */}
                <div>
                    <div className="mb-5 font-semibold text-xl">Thông tin liên lạc của bạn ?</div>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* start input PaymentType */}
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">Hình thức thanh toán</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                input={<OutlinedInput label="Hình thức thanh toán" />}
                                fullWidth
                                error={errors.paymentType ? true : false}
                                defaultValue={''}
                                {...register('paymentType', {
                                    required: 'PaymentType is required',
                                })}
                            >
                                <MenuItem value={config.PaymentType.VNPay}>
                                    {config.PaymentType.VNPay}
                                </MenuItem>
                                <MenuItem value={config.PaymentType.CashOnDelivery}>
                                    {config.PaymentType.CashOnDelivery}
                                </MenuItem>
                            </Select>
                        </FormControl>
                        {/* end input PaymentType */}
                        {/* start input address */}
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">Địa chỉ</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                input={<OutlinedInput label="Địa chỉ" />}
                                fullWidth
                                error={errors.addressId ? true : false}
                                defaultValue={''}
                                {...register('addressId', {
                                    required: 'address is required',
                                })}
                            >
                                {listAddress.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>
                                        <div>
                                            <span>{item.fullName}</span>
                                            <span className="px-3">|</span>
                                            <span>{item.phoneNumber}</span>
                                            <div>{item.orderDetails}</div>
                                            <div>
                                                {item.ward}, {item.district}, {item.city}
                                            </div>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* end input address */}
                        {/* start input firtname */}
                        <Textarea
                            register={{
                                ...register('note'),
                            }}
                        />
                        {/* end input firtname */}
                        <Button
                            style={{ background: isChecked ? 'black' : '', height: '50px' }}
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="primary"
                            size="large"
                            disabled={!isChecked}
                        >
                            Đặt hàng
                        </Button>
                        <div className="grid grid-cols-10">
                            <span>
                                <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
                            </span>
                            <span className="col-span-9 text-gray-400">
                                Tôi đã đọc và đồng ý cho Duck xử lý thông tin của tôi theo
                                <span className="underline ml-0.5">Quy định về Quyền riêng tư</span> và
                                <span className="underline ml-0.5"> Chính sách Cookie </span>. Duck là đối tác tin cậy
                                của Duck.
                            </span>
                        </div>
                    </form>
                </div>
                {/* end infomation */}
                {/* start bill */}
                <div className="space-y-5">
                    <h1 className="text-2xl font-semibold text-center">Tổng chi phí</h1>
                    <div className="grid grid-cols-3">
                        <span className="text-left col-span-2">Tổng tiền Sản phẩm</span>
                        <span className="text-right">
                            <span className='black-dong'>đ</span>
                            {totalPrice.toLocaleString('vi-VN')}
                        </span>
                    </div>
                    <div className="grid grid-cols-3">
                        <span className="text-left col-span-2">Phí</span>
                        <span className="text-right">Miễn phí</span>
                    </div>
                    <div className="grid grid-cols-3 relative py-10">
                        <span className="absolute left-0 top-5 h-0.5 bg-gray-200 w-full"></span>
                        <span className="text-left col-span-2">Tổng thanh toán</span>
                        <span className="text-right">
                            <span className='dong'>đ</span>
                            <span className='price'>
                                {totalPrice.toLocaleString('vi-VN')}
                            </span>
                        </span>
                        <span className="absolute left-0 bottom-5 h-0.5 bg-gray-200 w-full"></span>
                    </div>
                    <div className="text-center text-gray-400">
                        (Tổng cộng giá của đơn hàng của bạn, bao gồm tất cả các chi phí và thuế)
                    </div>
                    <div className="font-semibold text-xl text-center pt-10">
                        Bạn muốn nhận đơn hàng của mình như thế nào?
                    </div>
                    <div className="text-gray-400">
                        Quy định hải quan yêu cầu một bản sao của KYC của người nhận. Địa chỉ trên KYC cần phải khớp với
                        địa chỉ giao hàng. Dịch vụ chuyển phát của chúng tôi sẽ liên lạc với bạn qua SMS/email để có
                        được một bản sao của KYC của bạn. KYC sẽ được lưu trữ an toàn và chỉ được sử dụng cho mục đích
                        làm rõ hải quan (bao gồm việc chia sẻ nó với các quan chức hải quan) cho tất cả các đơn đặt hàng
                        và đổi/trả hàng. Nếu KYC của bạn không khớp với địa chỉ giao hàng của bạn, vui lòng nhấp vào
                        liên kết để biết thêm thông tin.
                        <span className="underline hover:text-black ml-0.5">Đọc thêm</span>
                    </div>
                </div>
                {/* end bill */}
            </div>
        </div>
    );
};

export default Pay;
