import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';

interface Iprops {
    listImage: Array<string>;
    className?: string;
}

export default function App(props: Iprops) {
    const { listImage, className } = props;
    return (
        <>
            <Swiper
                spaceBetween={50}
                centeredSlides={true}
                autoplay={{
                    delay: 1300,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards, Autoplay, Navigation]}
                className={`${className}`}
            >
                {listImage.map((item, index) => (
                    <SwiperSlide key={index}>
                        <img src={item} className="rounded h-full w-full object-cover object-center" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
