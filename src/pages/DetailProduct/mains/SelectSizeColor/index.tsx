// libs
import { useTranslation } from 'react-i18next';
// types
import IProduct from '@/types/product';
// components
import Button from '@/components/Button';

const SelectSizeColor = ({
    setSize,
    setPicColor,
    setColor,
    size,
    product,
    color,
}: {
    setSize: React.Dispatch<React.SetStateAction<string>>;
    setPicColor: React.Dispatch<React.SetStateAction<string>>;
    setColor: React.Dispatch<React.SetStateAction<string>>;
    size: string;
    product?: IProduct;
    color: string;
}) => {
    const { t } = useTranslation('detailProduct');

    const handleChangeSize = (sizeOption: string) => {
        setSize(sizeOption);
    };

    const handleChangePicColor = (pic: { valueName: string; imageUrl: string }) => {
        setPicColor(pic.imageUrl);
        setColor(pic.valueName);
    };
    return (
        <>
            <div className="grid grid-cols-2 gap-7">
                <div className="space-y-2">
                    <span className="font-medium">
                        {t('size')} : {size}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {product?.options
                            .filter(
                                (option) =>
                                    option.optionName.toLowerCase() === 'size' ||
                                    option.optionName.toLowerCase() === 'kích thước',
                            )
                            .flatMap((filteredOption) =>
                                filteredOption.values.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant={size === item.valueName ? 'fill' : 'outline'}
                                        className="!rounded-lg !p-1 !size-fit min-h-11 min-w-11 flex justify-center items-center"
                                        onClick={() => handleChangeSize(item.valueName)}
                                    >
                                        <span className="text-sm font-medium">{item.valueName}</span>
                                    </Button>
                                )),
                            )}
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="font-medium">
                        {t('color')} : {color}
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {product?.options
                            .filter(
                                (option) =>
                                    option.optionName.toLowerCase() === 'màu' ||
                                    option.optionName.toLowerCase() === 'color',
                            )
                            .flatMap((filteredOption) =>
                                filteredOption.values.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant={color === item.valueName ? 'fill' : 'outline'}
                                        className="!rounded-lg !p-0 !size-11 overflow-hidden flex justify-center items-center"
                                        onClick={() => handleChangePicColor(item)}
                                    >
                                        <img className="object-cover bg-center p-1 rounded-lg" src={item.imageUrl} />
                                    </Button>
                                )),
                            )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SelectSizeColor;
