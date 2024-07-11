// libs
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useTranslation } from 'react-i18next';
// components
import Search from '@/components/Search';
// others
import config from '@/config';

const FilterOrder = ({
    setStatusOrder,
    setPage,
    statusOrder,
    search,
    setSearch,
}: {
    setStatusOrder: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    statusOrder: string;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const { t } = useTranslation('purchaseHistory');

    const handleChangeStatus = (_: React.MouseEvent<HTMLElement>, status: string) => {
        setStatusOrder(status);
        setPage(1);
    };

    return (
        <div className="space-y-2 p-2 rounded bg-white dark:bg-dark-300">
            <ToggleButtonGroup
                value={statusOrder}
                exclusive
                onChange={handleChangeStatus}
                fullWidth
                className="!bg-white dark:!bg-dark-600 min-h-12"
                color="info"
            >
                <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={''}>
                    {t('all')}
                </ToggleButton>
                <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={config.StatusOrders.ORDERED}>
                    {t('ordered')}
                </ToggleButton>
                <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={config.StatusOrders.PROCESSING}>
                    {t('processing')}
                </ToggleButton>
                <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={config.StatusOrders.SHIPPED}>
                    {t('shipped')}
                </ToggleButton>
                <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={config.StatusOrders.DELIVERED}>
                    {t('delivered')}
                </ToggleButton>
                <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={config.StatusOrders.CANCELED}>
                    {t('canceled')}
                </ToggleButton>
                <ToggleButton className="!text-xs sm:!text-sm !capitalize" value={config.StatusOrders.WAITFORPAY}>
                    {t('waitForPay')}
                </ToggleButton>
            </ToggleButtonGroup>
            <Search search={search} setSearch={setSearch} placeholderSearch={t('searchTitle')} />
        </div>
    );
};

export default FilterOrder;
