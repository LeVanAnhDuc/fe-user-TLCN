// libss
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import ExitToApp from '@mui/icons-material/ExitToApp';
// components
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
// others
import config from '@/config';

const BreadcrumbsAction = ({ idProduct }: { idProduct?: string }) => {
    const { t } = useTranslation('purchaseHistory');
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center">
            <Breadcrumbs className="!font-medium">
                <Link className="text-primary-700 hover:underline dark:text-primary-500" to={config.Routes.home}>
                    {t('home')}
                </Link>
                <Link
                    className="text-primary-700 hover:underline dark:text-primary-500"
                    to={config.Routes.profileHistoryPaymentProfile}
                >
                    {t('listPurchase')}
                </Link>
                <AnimationTran tranY={-50}>{t('orderDetails')}</AnimationTran>
                <AnimationTran tranY={50}>{idProduct}</AnimationTran>
            </Breadcrumbs>
        </div>
    );
};

export default BreadcrumbsAction;
