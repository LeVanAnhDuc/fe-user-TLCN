// libs
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// components
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import AnimationScale from '@/components/AnimationScale';
// others
import * as homeImg from '@/assets/img/home/index';
import config from '@/config';

const CategorySection = () => {
    const { t } = useTranslation('home');

    return (
        <div className="w-10/12 flex flex-col justify-center m-auto my-8 gap-8">
            <div className="w-full grid justify-items-center gap-1">
                <div className="bg-black h-1 w-3/12 dark:bg-white"></div>
                <div className="uppercase text-xl font-semibold not-italic">{t('diverseStyles')}</div>
            </div>
            <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnimationTran tranX={-100}>
                    <div className="col-span-1 relative">
                        <img
                            src={homeImg.catogoryMen}
                            alt={homeImg.catogoryMen}
                            className="w-full h-full object-cover rounded-xl"
                        />
                        <AnimationScale
                            scale={0.2}
                            delay={0.3}
                            className="absolute inset-x-0 bottom-10 flex justify-center"
                        >
                            <Link
                                to={config.Routes.shop}
                                state={{
                                    category: 'Thời trang nam',
                                }}
                                className="flex"
                            >
                                <Button variant="outlineBlur">{t('menFashion')}</Button>
                            </Link>
                        </AnimationScale>
                    </div>
                </AnimationTran>
                <AnimationScale scale={0.7}>
                    <div className="col-span-1 relative">
                        <img
                            src={homeImg.catogoryWomen}
                            alt={homeImg.catogoryWomen}
                            className="w-full h-full object-cover rounded-xl"
                        />
                        <AnimationScale
                            scale={0.2}
                            delay={0.3}
                            className="absolute inset-x-0 bottom-10 flex justify-center"
                        >
                            <Link
                                to={config.Routes.shop}
                                state={{
                                    category: 'Thời trang nữ',
                                }}
                                className="flex"
                            >
                                <Button variant="outlineBlur">{t('womenFashion')}</Button>
                            </Link>
                        </AnimationScale>
                    </div>
                </AnimationScale>
                <AnimationTran tranX={100}>
                    <div className="col-span-1 relative">
                        <img
                            src={homeImg.catogoryChildren}
                            alt={homeImg.catogoryChildren}
                            className="w-full h-full object-cover rounded-xl"
                        />
                        <AnimationScale
                            scale={0.2}
                            delay={0.3}
                            className="absolute inset-x-0 bottom-10 flex justify-center"
                        >
                            <Link
                                to={config.Routes.shop}
                                state={{
                                    category: 'Thời trang trẻ em',
                                }}
                                className="flex"
                            >
                                <Button variant="outlineBlur">{t('childFashion')}</Button>
                            </Link>
                        </AnimationScale>
                    </div>
                </AnimationTran>
            </div>
        </div>
    );
};

export default CategorySection;
