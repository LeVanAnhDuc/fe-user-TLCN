// libs
import { useEffect } from 'react';
// types
import IAddress from '@/types/address';
import IProductCart from '@/types/productCart';
// apis
import { getFeeShipping } from '@/apis/GHN/FeeShip';
// others
import { calculateWeight } from '@/utils/calculateData';

const GetFeeShipping = ({
    addresses,
    watchedAddressId,
    productsPurchase,
    setFeePrice,
}: {
    addresses: IAddress[];
    watchedAddressId: number;
    productsPurchase: IProductCart[];
    setFeePrice: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const handleGetFeeShipping = async (to_district_id: number, to_ward_code: string) => {
        try {
            const response = await getFeeShipping(
                to_district_id,
                to_ward_code,
                calculateWeight(productsPurchase.reduce((sum, current) => sum + current.quantity, 0)),
            );

            if (response.status === 200) {
                setFeePrice(response.data.data.total);
            }
        } catch (error) {
            console.log(`${error}`);
        }
    };

    useEffect(() => {
        const address = addresses.filter((item: IAddress) => item.id === watchedAddressId)[0];

        handleGetFeeShipping(address?.districtId ?? 0, address?.wardCode ?? '');
    }, [watchedAddressId]);

    return null;
};

export default GetFeeShipping;
