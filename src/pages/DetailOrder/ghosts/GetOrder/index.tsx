// libss
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// types
import IOrder from '@/types/order';
// apis
import { getOrderByID } from '@/apis/orderApi';
// others
import config from '@/config';

const GetOrder = ({
    idProduct,
    firstLoadingAPI,
    setLoadingAPI,
    setFirstLoadingAPI,
    setOrder,
    setErrorAPI,
    behaviorGetOrders,
}: {
    idProduct?: string;
    firstLoadingAPI: boolean;
    setLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setFirstLoadingAPI: React.Dispatch<React.SetStateAction<boolean>>;
    setOrder: React.Dispatch<React.SetStateAction<IOrder | undefined>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    behaviorGetOrders: boolean;
}) => {
    const navigate = useNavigate();

    const getOrder = async () => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                firstLoadingAPI && setLoadingAPI(true);

                const [response] = await Promise.all([
                    getOrderByID(+idProduct),
                    firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
                ]);

                firstLoadingAPI && setLoadingAPI(false);

                if (response.status === 200) {
                    setFirstLoadingAPI(false);
                    setOrder(response.data);
                } else {
                    navigate(config.Routes.profileHistoryPaymentProfile);
                }
            } else {
                navigate(config.Routes.profileHistoryPaymentProfile);
            }
        } catch {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        idProduct && getOrder();
    }, [idProduct, behaviorGetOrders]);

    return null;
};

export default GetOrder;
