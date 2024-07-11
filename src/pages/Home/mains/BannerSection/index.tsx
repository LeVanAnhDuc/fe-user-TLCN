// libs
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// components
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
// others
import config from '@/config';

const BannerSection = () => {
    const { t } = useTranslation('home');

    return (
        <div className="w-full h-full py-80 bg-home-banner bg-cover bg-no-repeat bg-center relative bg-fixed scroll-smooth">
            <AnimationTran className="absolute top-16 right-0 sm:top-20 sm:right-20 md:top-18 md:right-40" tranX={-100}>
                <div className="w-[30rem] h-[28rem] bg-transparent border-2 border-primary-900 rounded-tl-[10rem] rounded-br-[10rem]"></div>
            </AnimationTran>
            <AnimationTran className="absolute top-12 right-2 sm:top-16 sm:right-24 md:top-16 md:right-44" tranX={100}>
                <div className="w-[30rem] h-[28rem] bg-primary-200 dark:bg-primary-900 rounded-tl-[10rem] rounded-br-[10rem]">
                    <div className="px-14 py-24 flex flex-col gap-8 justify-center ">
                        <div className="text-4xl font-bold text-primary-900 dark:text-primary-100 leading-tight">
                            {t('bannerTitle')}
                        </div>
                        <div className="font-medium">{t('bannerDescription')}</div>
                        <Link to={config.Routes.shop}>
                            <Button variant="fill">{t('buyNow')}</Button>
                        </Link>
                    </div>
                </div>
            </AnimationTran>
        </div>
    );
};

export default BannerSection;
