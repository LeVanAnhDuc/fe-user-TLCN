import { useTranslation } from 'react-i18next';

const Policy = () => {
    const { t } = useTranslation('policy');
    return (
        <section className="sm:w-10/12 w-11/12 flex flex-col m-auto py-10 space-y-20">
            <div className="text-4xl font-bold text-center">{t('title')}</div>
            <div className="space-y-8">
                <div className="font-bold text-lg italic"> {t('description')}</div>
                <ul className="pl-5 space-y-2">
                    <li> {t('methods.1')}.</li>
                    <li> {t('methods.2')}</li>
                    <li>{t('methods.3')}</li>
                    <li> {t('methods.4')}</li>
                </ul>
                <div className="font-bold text-lg italic">{t('confirmation')}</div>
            </div>
        </section>
    );
};

export default Policy;
