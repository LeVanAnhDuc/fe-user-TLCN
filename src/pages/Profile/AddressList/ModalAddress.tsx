import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import IAddress, { IAddressGHN } from '../../../interface/address';
import {
    addNewAddressForCurrentUser,
    getOneAddressByAddressID,
    updateAddressByAddressID,
} from '../../../apis/addressApi';
import Button from '../../../components/Button';
import { getDistrictsAPI, getProvincesAPI, getWardAPI } from '../../../apis/GHN/addressGHN';
import { initObjecAddressGHN } from '../../../constants';

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
    const [provinces, setProvinces] = useState<IAddressGHN[]>([initObjecAddressGHN]);
    const [province, setProvince] = useState<IAddressGHN | null>(null);
    const [districts, setDistricts] = useState<IAddressGHN[]>([initObjecAddressGHN]);
    const [district, setDistrict] = useState<IAddressGHN | null>(null);
    const [wards, setWards] = useState<IAddressGHN[]>([initObjecAddressGHN]);
    const [ward, setWard] = useState<IAddressGHN | null>(null);

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
            setProvince({
                id: 0,
                label: response.data.province,
                code: '0',
            });
            setDistrict({
                id: 0,
                label: response.data.district,
                code: '0',
            });
            setWard({
                id: 0,
                label: response.data.ward,
                code: '0',
            });
            setValue('orderDetails', response.data.orderDetails);
        }
    };

    const getProvinces = async () => {
        try {
            const response = await getProvincesAPI();

            const arrayTempo: IAddressGHN[] = [];
            response.data.data.forEach((item: { ProvinceName: string; ProvinceID: string; Code: string }) => {
                arrayTempo.push({ label: item.ProvinceName, id: +item.ProvinceID, code: item.Code });
            });
            setProvinces(arrayTempo);
        } catch (error) {
            console.log(error);
        }
    };

    const getDistricts = async (provinceParam: IAddressGHN) => {
        try {
            const response = await getDistrictsAPI(provinceParam.id);

            const arrayTempo: IAddressGHN[] = [];
            response.data.data.forEach((item: { DistrictName: string; DistrictID: string; Code: string }) => {
                arrayTempo.push({ label: item.DistrictName, id: +item.DistrictID, code: item.Code });
            });
            setDistricts(arrayTempo);
        } catch (error) {
            console.log(error);
        }
    };

    const getWards = async (districtParam: IAddressGHN) => {
        try {
            const response = await getWardAPI(districtParam.id);

            const arrayTempo: IAddressGHN[] = [];
            response.data.data.forEach((item: { WardName: string; WardCode: string }) => {
                arrayTempo.push({ label: item.WardName, id: +item.WardCode, code: item.WardCode });
            });
            setWards(arrayTempo);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeProvice = (_: React.SyntheticEvent, value: IAddressGHN | null) => {
        setProvince(value);
        setDistrict(initObjecAddressGHN);
        setWard(initObjecAddressGHN);
        value && getDistricts(value);
    };

    const handleChangeDistrict = (_: React.SyntheticEvent, value: IAddressGHN | null) => {
        setDistrict(value);
        value && getWards(value);
    };

    const handleChangeWard = (_: React.SyntheticEvent, value: IAddressGHN | null) => {
        setWard(value);
    };

    const onSubmit: SubmitHandler<IAddress> = async (data) => {
        if (idAddressUpdate) {
            setLoadingAPI(true);
            const response = await updateAddressByAddressID(idAddressUpdate, {
                ...data,
                province: province?.label,
                district: district?.label,
                ward: ward?.label,
                districtId: district?.id,
                provinceId: province?.id,
                wardCode: ward?.code,
            });
            setLoadingAPI(false);
            console.log(response);

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
            const response = await addNewAddressForCurrentUser({
                ...data,
                province: province?.label,
                district: district?.label,
                ward: ward?.label,
                districtId: district?.id,
                provinceId: province?.id,
                wardCode: ward?.code,
            });

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

    useEffect(() => {
        getProvinces();
    }, []);

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-10/12 bg-white border border-black rounded-lg p-6 dark:bg-dark-600">
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
                                <Autocomplete
                                    value={province}
                                    onChange={handleChangeProvice}
                                    options={provinces}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label={t('enterCity')} required />}
                                />
                                <div className="mt-1.5 h-4"></div>
                            </div>
                            <div className="size-full">
                                <Autocomplete
                                    disabled={province?.id ? false : true}
                                    value={district}
                                    onChange={handleChangeDistrict}
                                    options={districts}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField {...params} label={t('enterDistrict')} required />
                                    )}
                                />
                            </div>
                            <div className="size-full">
                                <Autocomplete
                                    disabled={district?.id ? false : true}
                                    value={ward}
                                    onChange={handleChangeWard}
                                    options={wards}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label={t('enterWard')} required />}
                                />
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
