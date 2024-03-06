import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import IAddress from '../../../interface/address';
import {
    addNewAddressForCurrentUser,
    getOneAddressByAddressID,
    updateAddressByAddressID,
} from '../../../apis/addressApi';
import TextField from '@mui/material/TextField';
import Button from '../../../components/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'white',
    border: '1px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

interface IPropsAddress {
    open: boolean;
    handleClose: () => void;
    idAddressUpdate: number | null;
    setRequestNewAddresses: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddress = (propsCh: IPropsAddress) => {
    const { open, handleClose, idAddressUpdate, setRequestNewAddresses } = propsCh;

    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);

    const schema = yup.object().shape({
        fullName: yup.string().required('Tên người nhận đang trống'),
        phoneNumber: yup
            .string()
            .required('Số điện thoại đang trống')
            .test('checkNumber', 'Số điện thoại không hợp lệ', (value) => {
                const regex = /^[0-9]+$/;
                return regex.test(value);
            })
            .min(10, 'Mật khẩu phải từ 10 kí tự trở lên')
            .max(11, 'Mật khẩu phải từ 11 kí tự trở xuống'),
        city: yup.string().required('Thành phố/Tỉnh đang trống'),
        district: yup.string().required('Tên Quận/Huyện đang trống'),
        ward: yup.string().required('Tên Phường/Xã đang trống'),
        orderDetails: yup.string().required('Địa chỉ cụ thể đang trống'),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IAddress>({
        resolver: yupResolver(schema),
    });

    const handleGetInfoAddress = async () => {
        if (idAddressUpdate !== null) {
            const response = await getOneAddressByAddressID(idAddressUpdate);
            setValue('fullName', response.data.fullName);
            setValue('phoneNumber', response.data.phoneNumber);
            setValue('city', response.data.city);
            setValue('district', response.data.district);
            setValue('ward', response.data.ward);
            setValue('orderDetails', response.data.orderDetails);
        }
    };

    const onSubmit: SubmitHandler<IAddress> = async (data) => {
        if (idAddressUpdate) {
            setLoadingAPI(true);
            const response = await updateAddressByAddressID(idAddressUpdate, data);
            setLoadingAPI(false);

            if (response) {
                if (response.status === 200) {
                    toast.success('Cập nhật thành công');
                    setRequestNewAddresses((prev) => !prev);
                } else {
                    toast.error(response.data.message || response.data);
                }
            }
        } else {
            setLoadingAPI(true);
            const response = await addNewAddressForCurrentUser(data);
            setLoadingAPI(false);

            if (response) {
                if (response.status === 200) {
                    toast.success('Thêm thành công');
                    setRequestNewAddresses((prev) => !prev);
                } else {
                    toast.error(response.data.message || response.data);
                }
            }
        }
        handleClose();
    };

    useEffect(() => {
        if (idAddressUpdate !== null) {
            handleGetInfoAddress();
        }
    }, [idAddressUpdate]);

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <div className="text-lg mb-4 font-bold uppercase">Thông tin địa chỉ</div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <Controller
                                    name="fullName"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.fullName ? true : false}
                                            fullWidth
                                            placeholder="Họ và tên"
                                            autoComplete="name"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm mt-1.5 h-4">{errors.fullName?.message}</p>
                            </div>

                            <div>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.phoneNumber ? true : false}
                                            fullWidth
                                            placeholder="Số điện thoại"
                                            autoComplete="phone"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm mt-1.5 h-4">{errors.phoneNumber?.message}</p>
                            </div>
                        </div>

                        <div>
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.city ? true : false}
                                        fullWidth
                                        placeholder="Thành phố/Tỉnh"
                                        autoComplete="address-level2"
                                    />
                                )}
                            />
                            <p className="text-red-600 text-sm mt-1.5 h-4">{errors.city?.message}</p>
                        </div>

                        <div>
                            <Controller
                                name="district"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.district ? true : false}
                                        fullWidth
                                        placeholder="Quận/Huyện"
                                        autoComplete="address-level3"
                                    />
                                )}
                            />
                            <p className="text-red-600 text-sm mt-1.5 h-4">{errors.district?.message}</p>
                        </div>

                        <div>
                            <Controller
                                name="ward"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.ward ? true : false}
                                        fullWidth
                                        placeholder="Phường/Xã"
                                        autoComplete="address-level4"
                                    />
                                )}
                            />
                            <p className="text-red-600 text-sm mt-1.5 h-4">{errors.ward?.message}</p>
                        </div>

                        <div>
                            <Controller
                                name="orderDetails"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.orderDetails ? true : false}
                                        fullWidth
                                        placeholder="Địa chỉ cụ thể"
                                        autoComplete="street-address"
                                    />
                                )}
                            />
                            <p className="text-red-600 text-sm mt-1.5 h-4">{errors.orderDetails?.message}</p>
                        </div>

                        <div className="flex justify-end gap-10">
                            <Button variant="text" onClick={handleClose}>
                                Trở lại
                            </Button>
                            <Button variant="fill" type="submit" loading={isLoadingAPI}>
                                Hoàn thành
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalAddress;
