import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import config from '../../config';
import images from '../../assets/img';
import Image from '../../components/Image';
import Button from '../../components/Button';

function Error404() {
    const { t } = useTranslation('error404');
    return (
        <section className="size-full rounded-lg bg-white dark:bg-dark-600 flex flex-col items-center justify-center gap-5 p-10">
            <Image src={images.noFound} alt="noFound" className="size-96" />
            <Link to={config.Routes.home}>
                <Button variant="fill">{t('back')}</Button>
            </Link>
        </section>
    );
}

export default Error404;
