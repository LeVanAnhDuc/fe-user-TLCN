import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import MapIcon from '@mui/icons-material/Map';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import config from '../../config';
import Logo from '../Logo';

function Footer() {
    const { t } = useTranslation('footer');

    const currentYear = new Date().getFullYear();
    const LINKS = [
        {
            title: t('product'),
            items: [
                { content: t('home'), to: config.Routes.home },
                { content: t('listProduct'), to: config.Routes.shop },
            ],
        },
        {
            title: t('policy'),
            items: [
                { content: t('tableSize'), to: config.Routes.tableSize },
                { content: t('policy'), to: config.Routes.policy },
            ],
        },
    ];

    return (
        <footer className="mt-auto bg-black text-gray-400 py-10">
            <div className="relative sm:w-10/12 w-11/12 m-auto">
                <div className="mx-auto w-full">
                    <div className="grid grid-cols-1 justify-between gap-x-4 gap-y-20 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Logo className="text-white text-6xl flex justify-center md:justify-start" />
                            <div className="flex gap-2 justify-center md:justify-start">
                                <div>{t('headOffice')}:</div>
                                <a
                                    href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+S%C6%B0+ph%E1%BA%A1m+K%E1%BB%B9+thu%E1%BA%ADt+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.8506377,106.7693382,17z/data=!3m1!4b1!4m6!3m5!1s0x31752763f23816ab:0x282f711441b6916f!8m2!3d10.8506324!4d106.7719131!16s%2Fm%2F02pz17z?entry=ttu"
                                    target="_blank"
                                    className="font-normal transition hover:text-primary-700 cursor-pointer"
                                >
                                    {t('university')}
                                </a>
                            </div>
                            <div className="flex flex-col gap-3 items-center justify-start  md:items-start">
                                <p className="text-sm">{t('followDUCK')}</p>
                                <div className="flex gap-4">
                                    <Link
                                        to={'https://www.facebook.com/qb.levananhduc'}
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <FacebookIcon fontSize="medium" />
                                    </Link>
                                    <Link
                                        to="https://www.instagram.com/hi.iam.lvad/"
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <InstagramIcon fontSize="medium" />
                                    </Link>
                                    <Link
                                        to={'https://github.com/LeVanAnhDuc'}
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <GitHubIcon fontSize="medium" />
                                    </Link>
                                    <Link
                                        to={
                                            'https://www.google.com/maps/dir//01+V%C3%B5+V%C4%83n+Ng%C3%A2n,+Linh+Chi%E1%BB%83u,+Th%E1%BB%A7+%C4%90%E1%BB%A9c,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh/@10.8506214,106.6895112,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x31752763f23816ab:0x282f711441b6916f!2m2!1d106.7719131!2d10.8506324?entry=ttu'
                                        }
                                        target="_blank"
                                        className="hover:text-primary-700"
                                    >
                                        <MapIcon fontSize="medium" />
                                    </Link>
                                    <a href={'mailto:levananhduc1804@gmail.com'} className="hover:text-primary-700">
                                        <EmailIcon fontSize="medium" />
                                    </a>
                                </div>
                            </div>
                            <div className="font-normal text-sm flex justify-center md:justify-start">
                                Duck &copy; {currentYear} . {t('copyright')}.
                            </div>
                        </div>
                        <div className="grid grid-cols-2 items-start">
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
