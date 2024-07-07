// libs
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// types
import { IUserInfoUpdate } from '@/interface/user';
// components
import Loading from '@/components/Loading';
import Error404 from '../../Error404';
import Form from './mains/Form';
// ghost
import GetUserInfo from './ghosts/GetUserInfo';

const Settings = () => {
    const savedInfoUser = localStorage.getItem('infoUser');
    const { t } = useTranslation('accountProfile');

    const [firstLoadingAPIGet, setFirstLoadingAPIGet] = useState<boolean>(true);
    const [isLoadingAPIGet, setLoadingAPIGet] = useState<boolean>(false);
    const [isLoadingAPIUpdate, setLoadingAPIUpdate] = useState<boolean>(false);
    const [user, setUser] = useState<IUserInfoUpdate>();
    const [errorAPI, setErrorAPI] = useState<boolean>(false);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetUserInfo
                {...{
                    savedInfoUser,
                    firstLoadingAPIGet,
                    setLoadingAPIGet,
                    setFirstLoadingAPIGet,
                    setUser,
                    setErrorAPI,
                }}
            />

            {isLoadingAPIGet ? (
                <Loading />
            ) : (
                <section className="bg-white p-7 rounded-lg dark:bg-dark-600">
                    <div className="space-y-5 lg:w-9/12 xl:w-7/12 m-auto">
                        <div className="font-bold text-xl text-center">{t('personalInformation')}</div>
                        <Form
                            {...{
                                user,
                                setUser,
                                setLoadingAPIUpdate,
                                isLoadingAPIUpdate,
                            }}
                        />
                    </div>
                </section>
            )}
        </>
    );
};

export default Settings;
