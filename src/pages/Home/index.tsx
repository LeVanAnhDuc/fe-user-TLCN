// components
import BannerSection from './mains/BannerSection';
import CarouselSection from './mains/CarouselSection';
import CategorySection from './mains/CategorySection';
import FavoriteProductSection from './mains/FavoriteProductSection';
import NewProductsSection from './mains/NewProductsSection';
import SellingProductsSection from './mains/SellingProductsSection';
import VideoSection from './mains/VideoSection';

const Home = () => (
    <>
        <BannerSection />
        <NewProductsSection />
        <CarouselSection />
        <CategorySection />
        <FavoriteProductSection />
        <SellingProductsSection />
        <VideoSection />
    </>
);

export default Home;
