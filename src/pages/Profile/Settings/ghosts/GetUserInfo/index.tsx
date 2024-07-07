// libs
import { useEffect } from 'react';
// types
import { IUserInfoUpdate } from '@/interface/user';
// apis
import { getUserByUserNameOrEmail } from '@/apis/userApi';

const GetUserInfo = ({
    savedInfoUser,
    firstLoadingAPIGet,
    setLoadingAPIGet,
    setFirstLoadingAPIGet,
    setUser,
    setErrorAPI,
}: {
    savedInfoUser: string | null;
    firstLoadingAPIGet: boolean;
    setLoadingAPIGet: React.Dispatch<React.SetStateAction<boolean>>;
    setFirstLoadingAPIGet: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<IUserInfoUpdate | undefined>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleGetUser = async () => {
        if (savedInfoUser) {
            const dataInfo = JSON.parse(savedInfoUser);
            try {
                firstLoadingAPIGet && setLoadingAPIGet(true);

                const [response] = await Promise.all([
                    getUserByUserNameOrEmail(dataInfo.userNameUser),
                    firstLoadingAPIGet && new Promise((resolve) => setTimeout(resolve, 250)),
                ]);

                firstLoadingAPIGet && setLoadingAPIGet(false);

                if (response.status === 200) {
                    setFirstLoadingAPIGet(false);

                    setUser({
                        username: response.data.username,
                        name: response.data.name,
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber,
                        gender: response.data.gender,
                    });
                } else {
                    setErrorAPI(true);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        }
    };
    useEffect(() => {
        handleGetUser();
    }, []);

    return null;
};

export default GetUserInfo;
