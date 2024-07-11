// libss
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
// types
import IOrder from '@/types/order';
// components
import Button from '@/components/Button';
import PopConfirm from '@/components/PopComfirm';
// apis
import { updateOrderStatusByID } from '@/apis/orderApi';
// others
import config from '@/config';

const ActionOrder = ({
    setBehaviorGetOrders,
    setErrorAPI,
    order,
}: {
    setBehaviorGetOrders: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
    order?: IOrder;
}) => {
    const { t } = useTranslation('purchaseHistory');
    const navigate = useNavigate();

    const handlePaymentOrder = async (idOder: number) => {
        if (idOder) {
            navigate(config.Routes.checkOut, { state: { idOder: idOder } });
        }
    };

    const handleCancelOrder = async (idProduct: number) => {
        try {
            const response = await updateOrderStatusByID(idProduct, config.StatusOrders.CANCELED);

            if (response.status === 200) {
                setBehaviorGetOrders((prev) => !prev);
                toast.success(t('successDeletion'));
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    return (
        <div className="flex justify-end gap-2">
            {(order?.status === config.StatusOrders.ORDERED || order?.status === config.StatusOrders.WAITFORPAY) && (
                <PopConfirm
                    title={t('popConfirmDeleteTitle')}
                    content={t('popConfirmDeleteContent')}
                    onConfirm={() => handleCancelOrder(order?.id)}
                    onCancel={() => toast.info(t('cancelDeletion'))}
                >
                    <Button
                        className="!min-h-10 min-w-28 !text-red-500 hover:text-red-800 !border-red-500 "
                        variant="outline"
                    >
                        {t('cancelOrder')}
                    </Button>
                </PopConfirm>
            )}

            {order?.status === config.StatusOrders.WAITFORPAY && (
                <Button className="!min-h-10 min-w-32" variant="fill" onClick={() => handlePaymentOrder(order?.id)}>
                    {t('payment')}
                </Button>
            )}
        </div>
    );
};

export default ActionOrder;
