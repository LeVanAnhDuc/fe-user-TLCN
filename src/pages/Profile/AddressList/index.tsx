// libs
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
// types
import IAddress from '@/types/address';
// components
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import AnimationTran from '@/components/AnimationTran';
import PopConfirm from '@/components/PopComfirm';
import ModalModifyAddress from './mains/ModalModifyAddress';
import Error404 from '../../Error404';
// apis
import { deleteAddressByAddressID, setDefaultAddress } from '@/apis/addressApi';
import GetAddresses from './ghosts/GetAddresses';

const AddressList = () => {
    const { t } = useTranslation('addressesProfle');

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [behaviorGetAddresses, setBehaviorGetAddresses] = useState<boolean>(false);
    const [idAddressUpdate, setIDAddressUpdate] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const handleCreateNew = useCallback(() => {
        setOpen(true);
        setIDAddressUpdate(null);
    }, []);

    const handleUpdate = useCallback((idAddress: number) => {
        setOpen(true);
        setIDAddressUpdate(idAddress);
    }, []);

    const handleClose = useCallback(() => setOpen(false), []);

    const handleSetDefault = async (idAddress: number) => {
        try {
            const response = await setDefaultAddress(idAddress);
            if (response.status === 200) {
                setBehaviorGetAddresses((prev) => !prev);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const deleteAddress = async (idAddress: number) => {
        try {
            const response = await deleteAddressByAddressID(idAddress);
            if (response.status === 200) {
                setBehaviorGetAddresses((prev) => !prev);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetAddresses
                {...{
                    firstLoadingAPI,
                    setLoadingAPI,
                    setFirstLoadingAPI,
                    setAddresses,
                    setErrorAPI,
                    behaviorGetAddresses,
                }}
            />

            <ModalModifyAddress
                open={open}
                handleClose={handleClose}
                idAddressUpdate={idAddressUpdate}
                setBehaviorGetAddresses={setBehaviorGetAddresses}
            />

            {isLoadingAPI ? (
                <Loading />
            ) : (
                <div className="size-full space-y-3">
                    <div className="flex justify-end relative ">
                        <Button onClick={handleCreateNew} variant="fill" className="text-sm">
                            {t('addNewAddress')}
                        </Button>
                    </div>
                    {addresses.length === 0 ? (
                        <div className="size-full flex flex-col items-center gap-5 ">
                            <ContentPasteSearch sx={{ fontSize: '100px' }} className="text-gray-400" />
                            <span className="text-xl text-gray-400">{t('noAddress')}</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {addresses.map((item, index) => (
                                <AnimationTran
                                    tranY={100}
                                    className="flex justify-between py-5 px-6 bg-white rounded-lg shadow dark:bg-dark-600"
                                    key={index}
                                    delay={(index % 4) / 20}
                                >
                                    <div className="text-sm my-auto">
                                        <div className="font-medium">{item.fullName}</div>
                                        <div>{item.phoneNumber}</div>
                                        <div>
                                            {item.orderDetails}, {item.ward}, {item.district}, {item.province}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Button
                                            className="min-w-36 !min-h-10 text-sm !p-2"
                                            variant="fill"
                                            disabled={item.isDefault ? true : false}
                                            onClick={() => handleSetDefault(item.id ? item.id : 0)}
                                        >
                                            {t('defaultSettings')}
                                        </Button>
                                        <div className="flex gap-3">
                                            <Button
                                                className="!p-2 !h-10 text-sm"
                                                variant="text"
                                                onClick={() => handleUpdate(item.id ? item.id : 0)}
                                            >
                                                {t('update')}
                                            </Button>
                                            {!item.isDefault && (
                                                <PopConfirm
                                                    title={t('confirmDeleteTitle')}
                                                    content={t('confirmDeleteContent')}
                                                    onConfirm={() => deleteAddress(item.id ? item.id : 0)}
                                                >
                                                    <Button className="!p-2 !h-10 text-sm text-red-500 hover:text-red-900">
                                                        {t('deleteAddress')}
                                                    </Button>
                                                </PopConfirm>
                                            )}
                                        </div>
                                    </div>
                                </AnimationTran>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AddressList;
