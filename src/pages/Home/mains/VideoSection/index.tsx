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

const VideoSection = () => {
    const { t } = useTranslation('home');

    return (
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
                            {t('videoTitle')}
                        </AnimationTran>
                        <AnimationTran tranY={100} delay={0.2}>
                            <Link to={config.Routes.shop}>
                                <Button variant="outlineBlur" className="m-auto">
                                    {t('seeStory')}
                                </Button>
                            </Link>
                        </AnimationTran>
                    </>
                </div>
            </>
        </AnimationScale>
    );
};

export default VideoSection;
