// libs
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// components
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import AnimationScale from '@/components/AnimationScale';
import Carousel from '@/components/Carousel';
// others
import * as homeImg from '@/assets/img/home/index';
import config from '@/config';

const CarouselSection = () => {
    const { t } = useTranslation('home');
    return (
        <>
            <div className="w-full flex flex-col justify-center items-center gap-1 my-5">
                <AnimationTran tranY={100} className="bg-black h-1 w-3/12 dark:bg-white"></AnimationTran>
                <AnimationTran tranY={100} delay={0.2} className="uppercase text-xl font-semibold not-italic">
                    {t('popularThisWeek')}
                </AnimationTran>
            </div>
            <div className="w-full py-16 bg-primary-200/80 dark:bg-primary-900">
                <div className="sm:w-10/12 w-11/12 relative grid grid-cols-1 md:grid-cols-2 gap-10 m-auto">
                    <div className="flex flex-col justify-center gap-10">
                        <AnimationTran tranX={-100}>
                            <div className="flex flex-col gap-4 text-center md:text-left md:mt-0">
                                <div className="text-5xl font-bold text-primary-800 dark:text-primary-100">
                                    {t('carouselTitle')}
                                </div>
                                <div className="font-medium ">{t('carouselDescription')}</div>
                            </div>
                        </AnimationTran>
                        <AnimationTran className="flex justify-center md:justify-start" tranY={100}>
                            <Link to={config.Routes.shop}>
                                <Button variant="fill">{t('exploreMore')}</Button>
                            </Link>
                        </AnimationTran>
                    </div>
                    <AnimationScale className="flex justify-center items-center" scale={0.5}>
                        <Carousel
                            listImage={[
                                homeImg.CAROUSEL1,
                                homeImg.CAROUSEL2,
                                homeImg.CAROUSEL3,
                                homeImg.CAROUSEL4,
                                homeImg.CAROUSEL5,
                                homeImg.CAROUSEL6,
                                homeImg.CAROUSEL7,
                                homeImg.CAROUSEL8,
                                homeImg.CAROUSEL9,
                                homeImg.CAROUSEL10,
                                homeImg.CAROUSEL11,
                                homeImg.CAROUSEL12,
                            ]}
                            className="w-80 h-80 lg:h-96 lg:w-96 xl:h-[26rem] xl:w-[26rem]"
                        />
                    </AnimationScale>
                </div>
            </div>
        </>
    );
};

export default CarouselSection;
