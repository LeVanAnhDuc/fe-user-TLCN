import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';

import ModalAddress from './ModalAddress';
import IAddress from '../../../interface/address';
import { deleteAddressByAddressID, getListAddressOffCurrentUser, setDefaultAddress } from '../../../apis/addressApi';
import Button from '../../../components/Button';
import Error404 from '../../Error404';
import Loading from '../../../components/Loading';
import AnimationTran from '../../../components/AnimationTran';

const AddressList = () => {
    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [addresses, setAddresses] = useState<Array<IAddress>>([]);
    const [requestNewAddresses, setRequestNewAddresses] = useState<boolean>(false);
    const [idAddressUpdate, setIDAddressUpdate] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const getListAddress = async () => {
        try {
            firstLoadingAPI && setLoadingAPI(true);

            const [response] = await Promise.all([
                getListAddressOffCurrentUser(),
                firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPI && setLoadingAPI(false);

            if (response.status === 200 && response?.data) {
                firstLoadingAPI && setFirstLoadingAPI(false);
                setAddresses(response.data);
            } else {
                setErrorAPI(true);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

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
                setRequestNewAddresses((prev) => !prev);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const deleteAddress = async (idAddress: number) => {
        const text = 'Đồng ý để xóa';
        if (confirm(text) == true) {
            try {
                const response = await deleteAddressByAddressID(idAddress);
                if (response.status === 200) {
                    setRequestNewAddresses((prev) => !prev);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        }
    };

    useEffect(() => {
        getListAddress();
    }, [requestNewAddresses]);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            {isLoadingAPI ? (
                <Loading />
            ) : (
                <div className="size-full space-y-3">
                    <div className="flex justify-end relative ">
                        <Button onClick={handleCreateNew} variant="fill" className="text-sm">
                            Thêm địa chỉ
                        </Button>
                    </div>
                    {addresses.length === 0 ? (
                        <div className="size-full flex flex-col items-center gap-5 ">
                            <ContentPasteSearch sx={{ fontSize: '100px' }} className="text-gray-400" />
                            <span className="text-xl text-gray-400">Hix. Không có địa chỉ nào. Bạn tạo mới nhé?</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {addresses.map((item, index) => (
                                <AnimationTran
                                    tranY={100}
                                    className="flex justify-between py-5 px-6 bg-white rounded-lg shadow"
                                    key={index}
                                    delay={(index % 4) / 20}
                                >
                                    <div className="text-sm my-auto">
                                        <div className="font-medium">{item.fullName}</div>
                                        <div>{item.phoneNumber}</div>
                                        <div>
                                            {item.orderDetails}, {item.ward}, {item.district}, {item.city}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Button
                                            className="min-w-40 !min-h-10 text-sm"
                                            variant="fill"
                                            disabled={item.isDefault ? true : false}
                                            onClick={() => handleSetDefault(item.id ? item.id : 0)}
                                        >
                                            Thiết lập mặc định
                                        </Button>
                                        <div className="flex gap-3">
                                            <Button
                                                className="!p-2 !h-10 text-sm"
                                                variant="text"
                                                onClick={() => handleUpdate(item.id ? item.id : 0)}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                            {!item.isDefault && (
                                                <Button
                                                    className="!p-2 !h-10 text-sm text-red-500 hover:text-red-900"
                                                    onClick={() => deleteAddress(item.id ? item.id : 0)}
                                                >
                                                    Xóa
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </AnimationTran>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {open && (
                <ModalAddress
                    open={open}
                    handleClose={handleClose}
                    idAddressUpdate={idAddressUpdate}
                    setRequestNewAddresses={setRequestNewAddresses}
                />
            )}
        </>
    );
};

export default AddressList;
