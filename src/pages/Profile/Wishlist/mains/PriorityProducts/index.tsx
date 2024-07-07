// libs
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React from 'react';
import { useTranslation } from 'react-i18next';
// types
import IFollowProduct from '@/interface/followProduct';
import { actionProduct } from '@/interface/product';
// components
import AnimationTran from '@/components/AnimationTran';
import Button from '@/components/Button';
import PopConfirm from '@/components/PopComfirm';
import Image from '@/components/Image';
// apis
import { updateProductAnalysis } from '@/apis/productApi';
import { getCountItemOfWishList, putFollowProduct } from '@/apis/followProductApi';
// redux
import { setToTalWishList } from '../../wishListSlice';
// others
import config from '@/config';
import { convertNumberToVND } from '@/utils/convertData';

const PriorityProducts = ({
    priorityProducts,
    setBehaviorGetPriorityProducts,
}: {
    priorityProducts: IFollowProduct[];
    setBehaviorGetPriorityProducts: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { t } = useTranslation('wishList');

    const handleRedirectDetailItem = async (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
            const actionClick: actionProduct = 'click';
            await updateProductAnalysis(idProduct, actionClick);
        }
    };

    const handleToggleFollow = async (idProduct: number) => {
        try {
            await putFollowProduct(idProduct);

            const response = await getCountItemOfWishList();

            if (response.status === 200) {
                dispatch(setToTalWishList(+response.data));
                setBehaviorGetPriorityProducts((prev) => !prev);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="space-y-4 pb-16">
            {priorityProducts.map((item, index) => (
                <AnimationTran
                    tranY={100}
                    key={index}
                    className="h-fit w-full grid grid-cols-12 bg-white rounded-lg overflow-hidden dark:bg-dark-600"
                    delay={(index % 4) / 20}
                >
                    <Image
                        src={item.product.imageUrl}
                        alt={'image' + item.product.name}
                        className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer max-h-36 max-w-36"
                        onClick={() => handleRedirectDetailItem(item.product.productId)}
                    />
                    <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between p-3 sm:p-4">
                        <div className="line-clamp-2 font-semibold mb-3">{item.product.name}</div>
                        <div className="flex justify-between items-center flex-wrap gap-1">
                            <div className="flex gap-2 items-center">
                                <span className="font-bold ">{t('price')}: </span>
                                <span className="not-italic font-medium text-red-500 flex gap-1">
                                    {convertNumberToVND(item.product.price)}
                                    <span className="text-xs"> đ</span>
                                </span>
                            </div>
                            <div className="w-full flex items-center gap-3 sm:w-fit justify-between">
                                <PopConfirm
                                    title={t('titleConfirm')}
                                    content={t('contentConfirm')}
                                    onConfirm={() => handleToggleFollow(item.product.productId)}
                                >
                                    <Button className="text-sm !p-2 !h-11" variant="text">
                                        {t('unFavourite')}
                                    </Button>
                                </PopConfirm>
                                <Button
                                    onClick={() => handleRedirectDetailItem(item.product.productId)}
                                    className="text-sm !p-2 !h-11"
                                    variant="fill"
                                >
                                    {t('buyNow')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimationTran>
            ))}
        </div>
    );
};

export default PriorityProducts;
