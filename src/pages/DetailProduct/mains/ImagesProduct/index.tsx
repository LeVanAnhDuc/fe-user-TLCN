// libs
import { useEffect, useState } from 'react';
// types
import IProduct from '@/types/product';

const ImagesProduct = ({
    product,
    setPicColor,
    setCurrentImageIndex,
}: {
    product?: IProduct;
    setPicColor: React.Dispatch<React.SetStateAction<string>>;
    setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [imagesProduct, setImagesProducts] = useState<string[]>(product?.listImages || []);

    const handleChangePicHover = (index: number) => {
        setPicColor('');
        setCurrentImageIndex(index);
    };

    useEffect(() => {
        product && setImagesProducts(product.listImages);
    }, [product]);

    return (
        <div className="hidden col-span-1 lg:block h-[33rem] space-y-2.5 overflow-y-auto hide-scrollbar ">
            {imagesProduct.map((item, index) => (
                <img
                    src={item}
                    key={index}
                    alt={item}
                    className="w-full h-20 object-cover object-center rounded hover:scale-95 transition"
                    onMouseEnter={() => handleChangePicHover(index)}
                />
            ))}
        </div>
    );
};

export default ImagesProduct;
