import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined';
import InventoryOutlined from '@mui/icons-material/InventoryOutlined';
import AirportShuttleOutlined from '@mui/icons-material/AirportShuttleOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import { BarChart } from '@mui/x-charts/BarChart';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getDataStatisticUser } from '../../../apis/statisticApi';
import CardStatictis from './CardStatictis';
import Error404 from '../../Error404';
import AnimationTran from '../../../components/AnimationTran';
import config from '../../../config';

interface IDashboard {
    favoriteCount: number;
    ordered: number;
    shipping: number;
    delivered: number;
}
const Dashboard = () => {
    const { t } = useTranslation('myPage');
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [statictis, setStatictis] = useState<IDashboard>();
    const getDataStatistic = async () => {
        try {
            const response = await getDataStatisticUser();

            if (response.status === 200) {
                setStatictis(response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        getDataStatistic();
    }, []);

    if (errorAPI) {
        return <Error404 />;
    }
    return (
        <>
            <div className="flex flex-col gap-5">
                <div className="size-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <CardStatictis
                        icon={VolunteerActivismOutlined}
                        data={statictis?.favoriteCount}
                        content={t('care')}
                        link={config.Routes.profileFavouriteProfile}
                        className="bg-orange-200 dark:bg-orange-300"
                    />
                    <CardStatictis
                        icon={InventoryOutlined}
                        data={statictis?.ordered}
                        content={t('ordered')}
                        link={config.Routes.profileHistoryPaymentProfile}
                        status={config.StatusOrders.ORDERED}
                        className="bg-red-200 dark:bg-red-300"
                        delay={0.1}
                    />
                    <CardStatictis
                        icon={AirportShuttleOutlined}
                        data={statictis?.shipping}
                        content={t('beingDelivered')}
                        link={config.Routes.profileHistoryPaymentProfile}
                        status={config.StatusOrders.SHIPPED}
                        className="bg-green-200 dark:bg-green-300"
                        delay={0.2}
                    />
                    <CardStatictis
                        icon={ShoppingBagOutlined}
                        data={statictis?.delivered}
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
                                    statictis?.favoriteCount || 0,
                                    statictis?.ordered || 0,
                                    statictis?.shipping || 0,
                                    statictis?.delivered || 0,
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
