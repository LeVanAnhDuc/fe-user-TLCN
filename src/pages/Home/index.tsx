import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import * as homeImg from '../../assets/img/home/index';
import config from '../../config';
import { checkExpiredToken } from '../../apis/authApi';
import { setIsLogin } from '../LogIn/loginSlice';
import AnimationTran from '../../components/AnimationTran';
import Button from '../../components/Button';
import AnimationScale from '../../components/AnimationScale';
import Carousel from '../../components/Carousel';

function Home() {
    const dispatch = useDispatch();
    const navaigate = useNavigate();

    const handleCheckToken = async (token: string) => {
        const response = await checkExpiredToken(token);
        if (response.status !== 200) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenType');
            localStorage.removeItem('infoUser');
            localStorage.removeItem('totalProductInCart');
            localStorage.removeItem('totalWishList');
            dispatch(setIsLogin(false));
            navaigate('/');
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            handleCheckToken(accessToken);
        }
    }, []);

    return (
        <>
            <div className="w-full h-full py-80 bg-home-banner bg-cover bg-no-repeat bg-center relative bg-fixed scroll-smooth">
                <AnimationTran
                    className="absolute top-16 right-0 sm:top-20 sm:right-20 md:top-18 md:right-40"
                    tranX={-100}
                >
                    <div className="w-[30rem] h-[28rem] bg-transparent border-2 border-primary-900 rounded-tl-[10rem] rounded-br-[10rem]"></div>
                </AnimationTran>
                <AnimationTran
                    className="absolute top-12 right-2 sm:top-16 sm:right-24 md:top-16 md:right-44"
                    tranX={100}
                >
                    <div className="w-[30rem] h-[28rem] bg-primary-200 dark:bg-primary-600 rounded-tl-[10rem] rounded-br-[10rem]">
                        <div className="px-14 py-24 flex flex-col gap-8 justify-center ">
                            <div className="text-4xl font-bold text-primary-900 dark:text-primary-300 leading-tight">
                                Nghệ thuật ăn mặc
                            </div>
                            <div className="font-medium">
                                Không chỉ là thời trang, DUCK còn là “phòng thí nghiệm” của tuổi trẻ - nơi nghiên cứu và
                                cho ra đời nguồn năng lượng mang tên “Youth”. Chúng mình luôn muốn tạo nên những trải
                                nghiệm vui vẻ, năng động và trẻ trung.
                            </div>
                            <Link to={config.Routes.listProducts}>
                                <Button variant="fill">Mua ngay</Button>
                            </Link>
                        </div>
                    </div>
                </AnimationTran>
            </div>

            <div className="w-full flex flex-col justify-center items-center gap-1 my-5">
                <AnimationTran tranY={100} className="bg-black h-1 w-3/12"></AnimationTran>
                <AnimationTran tranY={100} delay={0.2} className="uppercase text-xl font-semibold not-italic">
                    NHỮNG ĐIỂM NỔI BẬT TRONG TUẦN NÀY
                </AnimationTran>
            </div>
            <div className="w-full py-16 bg-primary-200/80 dark:bg-primary-600">
                <div className="sm:w-10/12 w-11/12 relative grid grid-cols-1 md:grid-cols-2 gap-10 m-auto">
                    <div className="flex flex-col justify-center gap-10">
                        <AnimationTran tranX={-100}>
                            <div className="flex flex-col gap-4 text-center md:text-left md:mt-0">
                                <div className="text-5xl font-bold text-primary-800 dark:text-primary-300">
                                    50+ Thời trang có cảm hứng
                                </div>
                                <div className="font-medium ">
                                    Nhà thiết kế của chúng tôi đã tạo ra rất nhiều nguyên mẫu sản phẩm đẹp đẽ truyền cảm
                                    hứng cho bạn
                                </div>
                            </div>
                        </AnimationTran>
                        <AnimationTran className="flex justify-center md:justify-start" tranY={100}>
                            <Link to={config.Routes.listProducts}>
                                <Button variant="fill">Tìm hiểm thêm</Button>
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
                            ]}
                            className="w-80 h-80 lg:h-96 lg:w-96 xl:h-[26rem] xl:w-[26rem]"
                        />
                    </AnimationScale>
                </div>
            </div>

            <div className="w-10/12 flex flex-col justify-center m-auto my-8 gap-8">
                <div className="w-full grid justify-items-center gap-1">
                    <div className="bg-black h-1 w-3/12"></div>
                    <div className="uppercase text-xl font-semibold not-italic">Những Điều Cần Thiết</div>
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
                                <Link to={config.Routes.listProducts + `#cate:Thời trang nam`} className="flex">
                                    <Button variant="outlineBlur">Thời trang nam</Button>
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
                                <Link to={config.Routes.listProducts + `#cate:Thời trang nữ`} className="flex">
                                    <Button variant="outlineBlur">Thời trang nữ</Button>
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
                                <Link to={config.Routes.listProducts + `#cate:Thời trang trẻ em`} className="flex">
                                    <Button variant="outlineBlur">Thời trang trẻ em</Button>
                                </Link>
                            </AnimationScale>
                        </div>
                    </AnimationTran>
                </div>
            </div>

            <AnimationScale className="w-full my-10 relative " scale={0.8}>
                <>
                    <video autoPlay muted loop className="w-full">
                        <source src={homeImg.videoIntro} type="video/mp4" />
                    </video>
                    <div className="w-full flex flex-col absolute bottom-0 text-center mb-4">
                        <>
                            <AnimationTran
                                tranY={100}
                                className="w-full h-auto mb-4 lg:text-4xl md:text-2xl text-xl font-medium not-italic tracking-widest text-white uppercase"
                            >
                                Xem các phụ kiện thời trang dành cho bạn
                            </AnimationTran>
                            <AnimationTran tranY={100} delay={0.2}>
                                <Link to={config.Routes.listProducts}>
                                    <Button variant="outlineBlur" className="m-auto">
                                        Xem cửa hàng
                                    </Button>
                                </Link>
                            </AnimationTran>
                        </>
                    </div>
                </>
            </AnimationScale>
        </>
    );
}

export default Home;
