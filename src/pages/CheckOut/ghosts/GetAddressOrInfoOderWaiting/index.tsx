// libs
import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
// types
import { IOrderCheckOut } from '@/types/order';
import IAddress from '@/types/address';
// apis
import { getListAddressOffCurrentUser } from '@/apis/addressApi';
import { getOrderByID } from '@/apis/orderApi';

const GetAddressOrInfoOderWaiting = ({
    setAddresses,
    idOrder,
    setTotalPrice,
    setValue,
}: {
    setAddresses: React.Dispatch<React.SetStateAction<IAddress[]>>;
    idOrder: number;
    setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
    setValue: UseFormSetValue<IOrderCheckOut>;
}) => {
    const getAddresses = async () => {
        try {
            const [addressesAPI] = await Promise.all([getListAddressOffCurrentUser()]);

            if (addressesAPI.status === 200 && addressesAPI?.data) {
                setAddresses(addressesAPI.data);
                const address = addressesAPI.data.filter((item: IAddress) => item.isDefault === true)[0];
                setValue('addressId', address.id);
            }
        } catch (error) {
            console.log(`${error}`);
        }
    };

    const getAddressesAndOrderForWaiting = async () => {
        try {
            const [addressesAPI, OrderByIDAPI] = await Promise.all([
                getListAddressOffCurrentUser(),
                getOrderByID(+idOrder),
            ]);

            if (addressesAPI.status === 200 && addressesAPI?.data) {
                setAddresses(addressesAPI.data);
            }
            if (OrderByIDAPI.status === 200) {
                setTotalPrice(OrderByIDAPI.data.total);

                setValue('addressId', OrderByIDAPI.data.address.id);
                setValue('note', OrderByIDAPI.data.note);
                setValue('paymentType', OrderByIDAPI.data.paymentType);
            }
        } catch (error) {
            console.log(`${error}`);
        }
    };

    useEffect(() => {
        if (idOrder) {
            getAddressesAndOrderForWaiting();
        } else {
            getAddresses();
        }
    }, []);

    return null;
};

export default GetAddressOrInfoOderWaiting;
