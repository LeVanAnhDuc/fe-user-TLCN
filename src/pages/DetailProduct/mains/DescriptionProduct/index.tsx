// libs
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
// types
import IProduct from '@/types/product';

const DescriptionProduct = ({ product }: { product?: IProduct }) => {
    const { t } = useTranslation('detailProduct');

    return (
        <div className="bg-white rounded-lg p-5 space-y-5 shadow dark:bg-dark-600">
            <div className="text-lg font-medium uppercase">{t('description')}</div>
            <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: product?.description || '' }} />
        </div>
    );
};

export default DescriptionProduct;
