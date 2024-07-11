// libs
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// types
import IProduct from '@/types/product';
// components
import ChangeQuantity from './components/ChangeQuantity';
import RelatedProduct from './mains/RelatedProduct';
import DescriptionProduct from './mains/DescriptionProduct';
import ReviewProduct from './mains/ReviewProduct';
import ImagesProduct from './mains/ImagesProduct';
import ImageCenter from './mains/ImageCenter';
import InformationProduct from './mains/InformationProduct';
import SelectSizeColor from './mains/SelectSizeColor';
import ActionButton from './mains/ActionButton';
// ghosts
import ViewAnalysis from './ghosts/ViewAnalysis';
import GetProduct from './ghosts/GetProduct';
import GetPriceBySKU from './ghosts/GetPriceBySKU';

const DetailProduct = () => {
    const { id } = useParams();
    const { t } = useTranslation('detailProduct');

    const [favourite, setFavourite] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct>();
    const [ratingProduct, setRatingProduct] = useState<number>(0);
    const [categoryName, setCategoryName] = useState<string>('');
    const [color, setColor] = useState<string>('');
    const [size, setSize] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [picColor, setPicColor] = useState<string>('');
    const [quantityAvailableItem, setQuantityAvailableItem] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);

    return (
        <>
            <ViewAnalysis id={id} />
            <GetProduct
                {...{
                    setProduct,
                    setFavourite,
                    setRatingProduct,
                    setCategoryName,
                    id,
                    setQuantityAvailableItem,
                    setImages,
                }}
            />
            <GetPriceBySKU
                {...{ color, size, id, product, setProduct, setQuantityAvailableItem, quantity, setQuantity }}
            />

            <div className="bg-gray-100 dark:bg-dark-400">
                <div className="w-11/12 sm:w-10/12 m-auto py-10 space-y-10">
                    <div className="grid lg:grid-cols-12 gap-3">
                        <ImagesProduct {...{ product, setPicColor, setCurrentImageIndex }} />
                        <div className="lg:col-span-11 grid lg:grid-cols-12 gap-10">
                            <ImageCenter
                                {...{
                                    picColor,
                                    images,
                                    currentImageIndex,
                                    setPicColor,
                                    setCurrentImageIndex,
                                }}
                            />
                            <div className="lg:col-span-5 xl:col-span-6 space-y-7">
                                <InformationProduct {...{ product, ratingProduct }} />
                                <SelectSizeColor
                                    {...{
                                        setSize,
                                        setPicColor,
                                        setColor,
                                        size,
                                        product,
                                        color,
                                    }}
                                />

                                <div className="space-y-2">
                                    <span className="font-medium">{t('quantity')}</span>
                                    <div className="flex items-center gap-10">
                                        <ChangeQuantity
                                            quantity={quantity}
                                            setQuantity={setQuantity}
                                            quantityAvailableItem={quantityAvailableItem}
                                        />
                                        <div className="whitespace-nowrap space-x-2">
                                            <span className="font-medium">{quantityAvailableItem}</span>
                                            <span className="text-gray-500 dark:text-gray-300 text-sm">
                                                {t('productsAvailable')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <ActionButton
                                    {...{
                                        id,
                                        color,
                                        size,
                                        quantityAvailableItem,
                                        quantity,
                                        favourite,
                                        setSize,
                                        setColor,
                                        setQuantity,
                                        setFavourite,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <DescriptionProduct product={product} />
                    <ReviewProduct idProduct={id ? +id : 0} rating={ratingProduct} />
                    <RelatedProduct categoryName={categoryName} />
                </div>
            </div>
        </>
    );
};

export default DetailProduct;
