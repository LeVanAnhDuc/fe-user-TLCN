import VolunteerActivismTwoTone from '@mui/icons-material/VolunteerActivismTwoTone';
import InventoryTwoTone from '@mui/icons-material/InventoryTwoTone';
import AirportShuttleTwoTone from '@mui/icons-material/AirportShuttleTwoTone';
import ShoppingBagTwoTone from '@mui/icons-material/ShoppingBagTwoTone';

const Dashboard = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
            {/* start sp quan tam */}
            <div className="bg-[#FFEEE8] h-28 rounded grid grid-cols-3 items-center">
                <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                    <VolunteerActivismTwoTone sx={{ fontSize: 35, color: '#FF6636' }} />
                </div>
                <div className="col-span-2">
                    <div className="font-medium text-2xl">10</div>
                    <div className="text-sm text-gray-500">Sản phẩm quan tâm</div>
                </div>
            </div>
            {/* end sp quan tam */}
            {/* start doi xac nhan don hang */}
            <div className="bg-[#EBEBFF] h-28 rounded grid grid-cols-3 items-center">
                <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                    <InventoryTwoTone sx={{ fontSize: 35, color: '#564FFD' }} />
                </div>
                <div className="col-span-2">
                    <div className="font-medium text-2xl">18</div>
                    <div className="text-sm text-gray-500">Chờ thanh toán</div>
                </div>
            </div>
            {/* end doi xac nhan don hang */}
            {/* start sp đang giao */}
            <div className="bg-[#E1F7E3] h-28 rounded grid grid-cols-3 items-center">
                <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                    <AirportShuttleTwoTone sx={{ fontSize: 35, color: '#23BD33' }} />
                </div>
                <div className="col-span-2">
                    <div className="font-medium text-2xl">4</div>
                    <div className="text-sm text-gray-500">Đang giao</div>
                </div>
            </div>
            {/* end sp đang giao */}
            {/* start sp da thanh toan */}
            <div className="bg-[#FFF2E5] h-28 rounded grid grid-cols-3 items-center">
                <div className="h-16 w-16 bg-white rounded flex items-center justify-center m-auto">
                    <ShoppingBagTwoTone sx={{ fontSize: 35, color: '#FD8E1F' }} />
                </div>
                <div className="col-span-2">
                    <div className="font-medium text-2xl">12</div>
                    <div className="text-sm text-gray-500">Đã giao</div>
                </div>
            </div>
            {/* end sp da thanh toan */}
        </div>
    );
};

export default Dashboard;
