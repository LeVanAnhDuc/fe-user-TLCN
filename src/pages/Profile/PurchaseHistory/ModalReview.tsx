import Modal from '@mui/material/Modal';
import StarIcon from '@mui/icons-material/Star';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { IreviewOrder } from '../../../interface/review';
import IProductCart from '../../../interface/productCart';
import { addReview } from '../../../apis/reviewApi';
import Button from '../../../components/Button';
import Image from '../../../components/Image';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import React from 'react';
import { convertNumberToVND } from '../../../utils/convertData';

interface IPropsAddress {
    open: boolean;
    handleClose: () => void;
    orderItem: IProductCart;
    setCallAPIAgain: React.Dispatch<React.SetStateAction<boolean>>;
}
interface FormData {
    content?: string;
}

const ModalReview = (propsCh: IPropsAddress) => {
    const { open, handleClose, orderItem, setCallAPIAgain } = propsCh;
    const navigate = useNavigate();
    const { t } = useTranslation('purchaseHistory');

    const labels: { [index: string]: string } = {
        1: t('poor'),
        2: t('bad'),
        3: t('okay'),
        4: t('good'),
        5: t('excellent'),
    };
    function getLabelText(value: number) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    const schema = yup.object().shape({
        content: yup.string(),
    });

    const [valueRating, setValueRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState(-1);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (orderItem) {
            const objectUpdate: IreviewOrder = {
                content: data.content || '',
                stars: valueRating,
                itemId: orderItem.id,
                productId: orderItem.product.id,
            };
            try {
                setLoadingAPI(true);
                const response = await addReview(objectUpdate);
                setLoadingAPI(false);

                if (response.status === 201) {
                    toast.success(t('reviewSuccessful'));
                    setValue('content', '');
                    setValueRating(5);
                    setCallAPIAgain((prev) => !prev);
                } else {
                    toast.error(response.data.message || response.data);
                }
            } catch (error) {
                toast.error(`${error}`);
            }

            handleClose();
        }
    };

    const handleRedirectDetailItem = (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
        }
    };

    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 lg:w-8/12 bg-white rounded-lg p-8 space-y-10 dark:bg-dark-500">
                    <div className="size-full grid grid-cols-12 gap-1 overflow-hidden">
                        <Image
                            src={orderItem?.imageUrl || ''}
                            alt={'image' + orderItem?.product.name}
                            className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer rounded"
                            onClick={() => handleRedirectDetailItem(orderItem?.product.id)}
                        />
                        <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between gap-2 p-3 sm:p-4">
                            <div className="line-clamp-2 font-medium">{orderItem?.product.name}</div>
                            <div className="flex justify-between items-center flex-wrap gap-1">
                                <div>
                                    <div className="flex gap-2">
                                        <span className="w-18">{t('classification')}:</span>
                                        <span className="font-medium">
                                            {orderItem?.sku?.optionValues?.map((option, index) => (
                                                <React.Fragment key={index}>
                                                    {option.valueName}
                                                    {index < orderItem?.sku.optionValues.length - 1 ? ' - ' : ''}
                                                </React.Fragment>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="w-18">{t('quantity')}:</span>
                                        <span className="font-medium">{orderItem?.quantity}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="w-18">{t('unitPrice')}:</span>
                                        <span className="not-italic font-bold text-red-500 flex gap-1">
                                            {convertNumberToVND(orderItem?.price)}
                                            <span className="text-xs"> đ</span>
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="w-18">{t('totalPrice')}:</span>
                                        <div className="not-italic font-bold text-red-500 flex gap-1">
                                            {convertNumberToVND(orderItem?.subTotal)}
                                            <span className="text-xs">đ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className=" space-y-5">
                        <div className="flex items-center gap-5">
                            <span>{t('rate')}:</span>
                            <Rating
                                value={valueRating}
                                precision={1}
                                getLabelText={getLabelText}
                                onChange={(_, newValue) => {
                                    setValueRating(newValue || 1);
                                }}
                                onChangeActive={(_, newHover) => {
                                    setHoverRating(newHover);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                size="small"
                            />
                            {valueRating !== null && (
                                <div className="font-medium">
                                    {labels[hoverRating !== -1 ? hoverRating : valueRating]}
                                </div>
                            )}
                        </div>

                        <>
                            <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={errors.content ? true : false}
                                        multiline
                                        minRows={9}
                                        fullWidth
                                        label={t('productReview')}
                                    />
                                )}
                            />
                            <p className="text-red-600 text-sm mt-1.5">{errors.content?.message}</p>
                        </>

                        <div className="flex justify-end">
                            <Button className="w-40" variant="text" onClick={handleClose}>
                                {t('cancelRating')}
                            </Button>
                            <Button className="w-40" variant="fill" type="submit" loading={isLoadingAPI}>
                                {t('sendRating')}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ModalReview;
