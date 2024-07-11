// libs
import { useEffect } from 'react';
// types
import IAddress from '@/types/address';
// apis
import { getListAddressOffCurrentUser } from '@/apis/addressApi';

const GetAddresses = ({
    firstLoadingAPI,
    setLoadingAPI,
    setFirstLoadingAPI,
    setAddresses,
    setErrorAPI,
    behaviorGetAddresses,
}: {
    firstLoadingAPI: boolean;
    setLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setFirstLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setAddresses: React.Dispatch<React.SetStateAction<IAddress[]>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    behaviorGetAddresses: boolean;
}) => {
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

    useEffect(() => {
        getListAddress();
    }, [behaviorGetAddresses]);

    return null;
};

export default GetAddresses;
