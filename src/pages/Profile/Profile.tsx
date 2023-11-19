import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Dashboard from './Dashboard/Dashboard';
import Wishlist from './Wishlist/Wishlist';
import PurchaseHistory from './PurchaseHistory/PurchaseHistory';
import Settings from './Settings/Settings';
import AddressList from './AddressList/AddressList';
import ManagerPass from './ManagerPass/ManagerPass';

import { useCallback, useEffect, useState } from 'react';
import config from '../../config';
import { useLocation } from 'react-router-dom';

const Profile = () => {
    // handle get id
    const location = useLocation();
    const infoPage = location.hash.substring(1);

    const [valuePage, setValuePage] = useState(infoPage);
    useEffect(() => {
        setValuePage(location.hash.substring(1));
    }, [location.hash]);
    const handleChange = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            setValuePage(newValue);
            // Xóa fragment identifier khi component được mount
            window.location.hash = `#${newValue}`;
        },
        [valuePage],
    );
    let userName: string = '';
    let avatarUrl: string = '';
    const savedInfoUser = localStorage.getItem('infoUser');
    if (savedInfoUser) {
        const dataInfo = JSON.parse(savedInfoUser);
        userName = dataInfo.userName;
        avatarUrl = dataInfo.avatarUrl;
    }
    return (
        <div className="w-full m-auto pt-32">
            <div className="bg-headerProfile h-60 flex place-items-end place-content-center">
                <div className="w-11/12 bg-white h-3/4 flex place-items-center place-content-center border-2 border-headerProfile">
                    <Avatar alt="Remy Sharp" src={avatarUrl} sx={{ width: 76, height: 76 }} />
                    <div className="ml-5">
                        <div className="uppercase font-semibold text-2xl">{userName}</div>
                        <div className="text-sm text-gray-400">Khách hàng</div>
                    </div>
                </div>
            </div>
            <div className="w-11/12 m-auto">
                <TabContext value={valuePage}>
                    <Box sx={{ borderBottom: 2, borderColor: '#FFEEE8' }}>
                        <TabList onChange={handleChange} centered>
                            <Tab sx={{ color: 'black' }} label="Trang của bạn" value={config.PageInProfile.homeProfile} />
                            <Tab sx={{ color: 'black' }} label="Yêu thích" value={config.PageInProfile.favouriteProfile} />
                            <Tab sx={{ color: 'black' }} label="Địa chỉ" value={config.PageInProfile.addressProfile} />
                            <Tab sx={{ color: 'black' }} label="Lịch sử mua" value={config.PageInProfile.historyPaymentProfile} />
                            <Tab sx={{ color: 'black' }} label="Hồ sơ" value={config.PageInProfile.accountProfile} />
                            <Tab sx={{ color: 'black' }} label="Mật khẩu" value={config.PageInProfile.passWordProfile} />
                        </TabList>
                    </Box>
                    <TabPanel value={config.PageInProfile.homeProfile} sx={{ padding: 0 }}>
                        <Dashboard />
                    </TabPanel>
                    <TabPanel value={config.PageInProfile.favouriteProfile} sx={{ padding: 0 }}>
                        <Wishlist />
                    </TabPanel>
                    <TabPanel value={config.PageInProfile.addressProfile} sx={{ padding: 0 }}>
                        <AddressList />
                    </TabPanel>
                    <TabPanel value={config.PageInProfile.historyPaymentProfile} sx={{ padding: 0 }}>
                        <PurchaseHistory />
                    </TabPanel>
                    <TabPanel value={config.PageInProfile.accountProfile} sx={{ padding: 0 }}>
                        <Settings />
                    </TabPanel>
                    <TabPanel value={config.PageInProfile.passWordProfile} sx={{ padding: 0 }}>
                        <ManagerPass />
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    );
};

export default Profile;
