// libs
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined';
import InventoryOutlined from '@mui/icons-material/InventoryOutlined';
import AirportShuttleOutlined from '@mui/icons-material/AirportShuttleOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// types
import { ICardDashboard } from '@/types/common';
// components
import CardStatistics from './components/CardStatistics';
import Error404 from '../../Error404';
import AnimationTran from '@/components/AnimationTran';
// others
import config from '@/config';
import GetDataStatistics from './ghosts/GetDataStatistics';

const Dashboard = () => {
    const { t } = useTranslation('myPage');
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [statistics, setStatistics] = useState<ICardDashboard>();

    if (errorAPI) {
        return <Error404 />;
    }
    return (
        <>
            <GetDataStatistics {...{ setStatistics, setErrorAPI }} />
            <div className="flex flex-col gap-5">
                <div className="size-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <CardStatistics
                        icon={VolunteerActivismOutlined}
                        data={statistics?.favoriteCount}
                        content={t('care')}
                        link={config.Routes.profileFavouriteProfile}
                        className="bg-orange-200 dark:bg-orange-300"
                    />
                    <CardStatistics
                        icon={InventoryOutlined}
                        data={statistics?.ordered}
                        content={t('ordered')}
                        link={config.Routes.profileHistoryPaymentProfile}
                        status={config.StatusOrders.ORDERED}
                        className="bg-red-200 dark:bg-red-300"
                        delay={0.1}
                    />
                    <CardStatistics
                        icon={AirportShuttleOutlined}
                        data={statistics?.shipping}
                        content={t('beingDelivered')}
                        link={config.Routes.profileHistoryPaymentProfile}
                        status={config.StatusOrders.SHIPPED}
                        className="bg-green-200 dark:bg-green-300"
                        delay={0.2}
                    />
                    <CardStatistics
                        icon={ShoppingBagOutlined}
                        data={statistics?.delivered}
                        content={t('delivered')}
                        link={config.Routes.profileHistoryPaymentProfile}
                        status={config.StatusOrders.DELIVERED}
                        className="bg-blue-200 dark:bg-blue-300"
                        delay={0.3}
                    />
                </div>
                <AnimationTran tranY={50} delay={0.1} className="bg-white size-full rounded-lg dark:bg-dark-600">
                    <BarChart
                        xAxis={[
                            { scaleType: 'band', data: [t('care'), t('ordered'), t('beingDelivered'), t('delivered')] },
                        ]}
                        series={[
                            {
                                data: [
                                    statistics?.favoriteCount || 0,
                                    statistics?.ordered || 0,
                                    statistics?.shipping || 0,
                                    statistics?.delivered || 0,
                                ],
                            },
                        ]}
                        height={335}
                    />
                </AnimationTran>
            </div>
        </>
    );
};

export default Dashboard;
