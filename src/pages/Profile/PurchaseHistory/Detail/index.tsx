import { Link, useNavigate, useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import Image from '../../../../components/Image';
import config from '../../../../config';
import { getOrderByID } from '../../../../apis/orderApi';
import IOrder from '../../../../interface/order';
import { convertNumberToVND } from '../../../../utils/convertData';
import AnimationTran from '../../../../components/AnimationTran';
import ScrollButton from '../../../../components/ScrollButton/ScrollButton';
import Error404 from '../../../Error404';
import Loading from '../../../../components/Loading';

const Detail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const idProduct = id;

    const [firstLoadingAPI, setFirstLoadingAPI] = useState<boolean>(true);
    const [isLoadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [order, setOrder] = useState<IOrder>();

    const getOrder = async (id: number) => {
        try {
            if (idProduct && !isNaN(+idProduct)) {
                firstLoadingAPI && setLoadingAPI(true);

                const [response] = await Promise.all([
                    getOrderByID(id),
                    firstLoadingAPI && new Promise((resolve) => setTimeout(resolve, 250)),
                ]);

                firstLoadingAPI && setLoadingAPI(false);

                if (response.status === 200) {
                    setFirstLoadingAPI(false);
                    setOrder(response.data);
                } else {
                    navigate(config.Routes.profileHistoryPaymentProfile);
                }
            } else {
                navigate(config.Routes.profileHistoryPaymentProfile);
            }
        } catch {
            setErrorAPI(true);
        }
    };

    const handleRedirectDetailItem = (idProduct: number) => {
        if (idProduct) {
            navigate(`${config.Routes.detailProduct}/${idProduct}`);
        }
    };

    useEffect(() => {
        idProduct && getOrder(+idProduct);
    }, [idProduct]);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            {isLoadingAPI ? (
                <div className=" flex justify-center items-center min-h-[80vh]">
                    <Loading />
                </div>
            ) : (
                <section className="bg-gray-100 py-10 dark:bg-dark-400">
                    <ScrollButton />
                    <div className="w-10/12 m-auto space-y-10">
                        <Breadcrumbs className="!font-medium">
                            <Link
                                className="text-primary-700 hover:underline dark:text-primary-500"
                                to={config.Routes.home}
                            >
                                DUCK
                            </Link>
                            <Link
                                className="text-primary-700 hover:underline dark:text-primary-500"
                                to={config.Routes.profileHistoryPaymentProfile}
                            >
                                Lịch sử mua
                            </Link>
                            <AnimationTran tranY={-50}>Chi tiết đơn hàng</AnimationTran>
                            <AnimationTran tranY={50}>{idProduct}</AnimationTran>
                        </Breadcrumbs>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border bg-primary-100 p-4 text-lg dark:bg-dark-600" colSpan={2}>
                                        Chi tiết đơn hàng
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-dark-500">
                                <tr>
                                    <td className="border border-gray-300 p-3 min-w-40">Ngày xuất đơn</td>
                                    <td className="border border-gray-300 p-3 font-bold">
                                        <AnimationTran tranY={-50}>{order?.createdDate}</AnimationTran>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="border border-gray-300 p-3 min-w-40">Trạng thái</td>
                                    <td className="border border-gray-300 p-3 font-bold text-red-500">
                                        <AnimationTran tranY={-50} delay={0.02}>
                                            {order?.status}
                                        </AnimationTran>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3 min-w-40">Địa chỉ nhận hàng</td>
                                    <td className="border border-gray-300 p-3 font-bold">
                                        <AnimationTran tranY={-50} delay={0.04}>
                                            {order?.address.orderDetails}, {order?.address.ward},{' '}
                                            {order?.address.district},{order?.address.city}
                                        </AnimationTran>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3 min-w-40">Hình thức thanh toán</td>
                                    <td className="border border-gray-300 p-3 font-bold">
                                        <AnimationTran tranY={-50} delay={0.06}>
                                            {order?.paymentType}
                                        </AnimationTran>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3 min-w-40">Ghi chú</td>
                                    <td className="border border-gray-300 p-3 font-bold">
                                        <AnimationTran tranY={-50} delay={0.08}>
                                            {order?.note}
                                        </AnimationTran>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3 min-w-40">Tổng sản phẩm</td>
                                    <td className="border border-gray-300 p-3 font-bold">
                                        <AnimationTran tranY={-50} delay={0.1}>
                                            {order?.totalItems}
                                        </AnimationTran>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-3 min-w-40">Thành tiền</td>
                                    <td className="border border-gray-300 p-3 font-bold">
                                        <AnimationTran
                                            tranY={-50}
                                            delay={0.12}
                                            className="text-base not-italic font-medium text-red-500 flex gap-1"
                                        >
                                            {convertNumberToVND(order?.total)}
                                            <span className="text-sm pr-0.5">đ</span>
                                        </AnimationTran>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="space-y-5">
                            {order?.orderItems.map((itemProduct, indexProduct) => (
                                <Fragment key={indexProduct}>
                                    <AnimationTran
                                        tranY={100}
                                        className="size-full grid grid-cols-12 gap-1 overflow-hidden bg-white rounded-lg shadow dark:bg-dark-600"
                                    >
                                        <>
                                            <Image
                                                src={itemProduct.imageUrl}
                                                alt={'image' + itemProduct.product.name}
                                                className="col-span-3 md:col-span-2 object-cover object-center size-full cursor-pointer rounded max-h-40"
                                                onClick={() => handleRedirectDetailItem(itemProduct.product.id)}
                                            />
                                            <div className="col-span-9 md:col-span-10 text-sm flex flex-col justify-between gap-2 p-3 sm:p-4">
                                                <div className="line-clamp-2 font-medium">
                                                    {itemProduct.product.name}
                                                </div>
                                                <div className="flex justify-between items-center flex-wrap gap-1">
                                                    <div>
                                                        <div className="flex gap-2">
                                                            <span className="w-18">Phân loại:</span>
                                                            <span className="font-medium">
                                                                {itemProduct.sku?.optionValues?.map((option, index) => (
                                                                    <Fragment key={index}>
                                                                        {option.valueName}
                                                                        {index < itemProduct.sku.optionValues.length - 1
                                                                            ? ' - '
                                                                            : ''}
                                                                    </Fragment>
                                                                ))}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="w-18">Số lượng:</span>
                                                            <span className="font-medium">{itemProduct.quantity}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="w-18">Đơn giá: </span>
                                                            <span className="not-italic font-bold text-red-500 flex gap-1">
                                                                {convertNumberToVND(itemProduct.price)}
                                                                <span className="text-xs"> đ</span>
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="w-18">Tổng giá:</span>
                                                            <div className="not-italic font-bold text-red-500 flex gap-1">
                                                                {convertNumberToVND(itemProduct.subTotal)}
                                                                <span className="text-xs">đ</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    </AnimationTran>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default Detail;
