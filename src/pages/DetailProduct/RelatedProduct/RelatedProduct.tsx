import Button from '@mui/material/Button';
import CardComp from '../../../components/Card';
import { getAllProductSearchWithinPagination } from '../../../apis/productApi';
import IProduct from '../../../interface/product';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import config from '../../../config';
interface Iprops {
    categoryName: string;
}

const RelatedProduct = (props: Iprops) => {
    const { categoryName } = props;
    const [data, setData] = useState<Array<IProduct>>([]); // Dữ liệu từ API

    const getRelatedProduct = async (category: string) => {
        try {
            if (categoryName) {
                // tồn tai ma san pham và phải là số
                const pageNo = 1;
                const pageSize = 12;
                const key = '';
                const cate = category;
                const sort = '';
                const response = await getAllProductSearchWithinPagination(pageNo, pageSize, key, cate, sort);

                if (response.status === 200) {
                    setData(response.data.content);
                } else {
                    toast.error(response.data.message || response.data);
                }
            }
        } catch {
            toast.error('Đang bảo trì');
        }
    };
    useEffect(() => {
        getRelatedProduct(categoryName);
    }, [categoryName]);
    return (
        <>
            <div className="flex flex-wrap justify-between items-center bg-gray-200 p-3 rounded text-xl font-normal">
                <span>SẢN PHẨM LIÊN QUAN</span>
                <Link to={config.Routes.shop + `#cate:${categoryName}`}>
                    <Button>{`Xem tất cả >>`} </Button>
                </Link>
            </div>
            {data.length !== 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
                    {data.map((item, index) => (
                        <CardComp key={index} itemProduct={item} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center pt-20 text-xl  text-gray-400 gap-5">
                    Hix. Không có sản phẩm nào liên quan !!
                </div>
            )}
        </>
    );
};

export default RelatedProduct;
