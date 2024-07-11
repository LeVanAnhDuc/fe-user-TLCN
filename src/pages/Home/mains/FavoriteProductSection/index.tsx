// libs
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { useState } from 'react';
// components
import Card from '@/components/Card';
// types
import IProduct from '@/types/product';
// ghosts
import GetProductsFavorite from '../../ghosts/GetProductsFavorite';

const FavoriteProductSection = () => {
    const { t } = useTranslation('home');

    const [products, setProducts] = useState<IProduct[]>([]);

    return (
        <>
            <GetProductsFavorite setProducts={setProducts} />
            <div className="w-10/12 flex flex-col justify-center m-auto my-8 gap-8">
                <div className="w-full grid justify-items-center gap-1">
                    <div className="bg-black h-1 w-3/12 dark:bg-white"></div>
                    <div className="uppercase text-xl font-semibold not-italic">{t('favoriteProduct')}</div>
                </div>
                <div className="size-full">
                    <Swiper
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        grabCursor={true}
                        slidesPerView={4}
                        spaceBetween={15}
                        modules={[Autoplay]}
                        className="size-full"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id} className="!py-1">
                                <Card itemProduct={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default FavoriteProductSection;
