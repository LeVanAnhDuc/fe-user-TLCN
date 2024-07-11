// libs
import { useEffect } from 'react';
// types
import { ICardDashboard } from '@/types/common';

// apis
import { getDataStatisticUser } from '@/apis/statisticApi';

const GetDataStatistics = ({
    setStatistics,
    setErrorAPI,
}: {
    setStatistics: React.Dispatch<React.SetStateAction<ICardDashboard | undefined>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const getDataStatistic = async () => {
        try {
            const response = await getDataStatisticUser();

            if (response.status === 200) {
                setStatistics(response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    useEffect(() => {
        getDataStatistic();
    }, []);

    return null;
};

export default GetDataStatistics;
