import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import IAddress from '../../../interface/address';
import {
    addNewAddressForCurrentUser,
    getOneAddressByAddressID,
    updateAddressByAddressID,
} from '../../../apis/addressApi';
import TextField from '@mui/material/TextField';
import Button from '../../../components/Button';

interface IPropsAddress {
    open: boolean;
    handleClose: () => void;
    idAddressUpdate: number | null;
    setRequestNewAddresses: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddress = (propsCh: IPropsAddress) => {
    const { open, handleClose, idAddressUpdate, setRequestNewAddresses } = propsCh;

    const { t } = useTranslation('addressesProfle');

    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);

    const schema = yup.object().shape({
        fullName: yup.string().required(t('nameIsRequired')),
        phoneNumber: yup
            .string()
            .required(t('phoneIsRequired'))
            .test('checkNumber', t('phoneIsNotFormat'), (value) => {
                const regex = /^[0-9]+$/;
                return regex.test(value);
            })
            .min(10, t('phoneLeast10'))
            .max(11, t('phoneLess11')),
        city: yup.string().required(t('cityIsRequired')),
        district: yup.string().required(t('districtIsRequired')),
        ward: yup.string().required(t('wardIsRequired')),
        orderDetails: yup.string().required(t('orderDetailsIsRequired')),
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
                    toast.success(t('updateSuccessful'));
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
                    toast.success(t('addSuccessful'));
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
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-[40rem] bg-white border border-black rounded-lg p-6 dark:bg-dark-600">
                    <div className="mb-4 font-bold uppercase">{t('infoAddress')}</div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <Controller
                                    name="fullName"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.fullName ? true : false}
                                            fullWidth
                                            label={t('enterName')}
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
                                <p className="text-red-600 text-sm mt-1.5 h-4">{errors.phoneNumber?.message}</p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="size-full">
                                <Controller
                                    name="city"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.city ? true : false}
                                            label={t('enterCity')}
                                            autoComplete="address-level2"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm mt-1.5 h-4">{errors.city?.message}</p>
                            </div>
                            <div className="size-full">
                                <Controller
                                    name="district"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.district ? true : false}
                                            label={t('enterDistrict')}
                                            autoComplete="address-level3"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm mt-1.5 h-4">{errors.district?.message}</p>
                            </div>
                            <div className="size-full">
                                <Controller
                                    name="ward"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={errors.ward ? true : false}
                                            label={t('enterWard')}
                                            autoComplete="address-level4"
                                        />
                                    )}
                                />
                                <p className="text-red-600 text-sm mt-1.5 h-4">{errors.ward?.message}</p>
                            </div>
                        </div>

                        <div>
                            <Controller
                                name="orderDetails"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.orderDetails ? true : false}
                                        fullWidth
                                        label={t('enterOrderDetails')}
                                        autoComplete="street-address"
                                    />
                                )}
                            />
                            <p className="text-red-600 text-sm mt-1.5 h-4">{errors.orderDetails?.message}</p>
                        </div>

                        <div className="flex justify-end gap-5">
                            <Button className="text-sm" variant="text" onClick={handleClose}>
                                {t('return')}
                            </Button>
                            <Button className="text-sm" variant="fill" type="submit" loading={isLoadingAPI}>
                                {t('submit')}
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ModalAddress;
