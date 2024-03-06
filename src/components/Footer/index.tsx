import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import MapIcon from '@mui/icons-material/Map';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';

import config from '../../config';
import Logo from '../Logo';

const LINKS = [
    {
        title: 'Sản phẩm',
        items: [
            { content: 'Trang chủ', to: config.Routes.home },
            { content: 'Danh sách sản phẩm', to: config.Routes.shop },
            { content: 'Bảng Size', to: '' },
        ],
    },
    {
        title: 'Chính sách',
        items: [
            { content: 'Chính sách mua hàng', to: '' },
            { content: 'Chính sách bảo mật', to: '' },
            { content: 'Phương thức thanh toán', to: '' },
        ],
    },
];

const currentYear = new Date().getFullYear();

function Footer() {
    return (
        <footer className="mt-auto bg-black text-gray-400 py-10">
            <div className="relative sm:w-10/12 w-11/12 m-auto">
                <div className="mx-auto w-full">
                    <div className="grid grid-cols-1 justify-between gap-x-4 gap-y-20 md:grid-cols-2">
                        <div className="flex flex-col gap-1">
                            <Logo className="text-white text-7xl flex justify-center md:justify-start" />
                            <div className="font-normal flex justify-center md:justify-start">
                                Duck &copy; {currentYear} . Đã đăng ký Bản quyền.
                            </div>
                            <div className="flex flex-col gap-3 items-center justify-start  md:items-start">
                                <p className="">Theo dõi DUCK qua các nền tảng khác nhau</p>
                                <div className="flex gap-4">
                                    <Link
                                        to={'https://www.facebook.com/qb.levananhduc'}
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <FacebookIcon sx={{ fontSize: 33 }} />
                                    </Link>
                                    <Link
                                        to="https://www.instagram.com/hi.iam.lvad/"
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <InstagramIcon sx={{ fontSize: 33 }} />
                                    </Link>
                                    <Link
                                        to={'https://github.com/LeVanAnhDuc'}
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <GitHubIcon sx={{ fontSize: 33 }} />
                                    </Link>
                                    <Link
                                        to={
                                            'https://www.google.com/maps/dir//01+V%C3%B5+V%C4%83n+Ng%C3%A2n,+Linh+Chi%E1%BB%83u,+Th%E1%BB%A7+%C4%90%E1%BB%A9c,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.8506214,106.6895112,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x31752763f23816ab:0x282f711441b6916f!2m2!1d106.7719131!2d10.8506324?entry=ttu'
                                        }
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <MapIcon sx={{ fontSize: 33 }} />
                                    </Link>
                                    <a href={'mailto:levananhduc1804@gmail.com'} className="hover:text-primary-700">
                                        <EmailIcon sx={{ fontSize: 33 }} />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 items-start place-items-center">
                            {LINKS.map(({ title, items }) => (
                                <ul key={title}>
                                    <div className="mb-3 text-lg font-black cursor-context-menu uppercase">{title}</div>
                                    {items.map((content, index) => (
                                        <li key={index}>
                                            <Link to={content.to}>
                                                <p className="py-2.5 font-normal transition hover:text-primary-700 cursor-pointer">
                                                    {content.content}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
