import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Card from '../../components/Card';
import { getAllProductSearchWithinPagination } from '../../apis/productApi';
import IProduct, { IProductFilter } from '../../interface/product';
import config from '../../config';
import * as constants from '../../constants';
import Button from '../../components/Button';

interface Iprops {
    categoryName: string;
}

const RelatedProduct = (props: Iprops) => {
    const { categoryName } = props;
    const itemsPerPage = 8;
    const { t } = useTranslation('detailProduct');

    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getRelatedProduct = async () => {
            try {
                if (categoryName) {
                    const searchFilter: IProductFilter = {
                        pageNo: 1,
                        pageSize: itemsPerPage,
                        key: '',
                        cate: categoryName,
                        sort: '',
                    };
                    setIsLoading(true);
                    const response = await getAllProductSearchWithinPagination(searchFilter);
                    setIsLoading(false);

                    if (response.status === 200) {
                        setProducts(response.data.content);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        getRelatedProduct();
    }, [categoryName]);

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap justify-between items-center bg-white p-5 rounded-t-lg dark:bg-dark-600">
                <div className="text-lg font-medium uppercase">{t('relatedProducts')}</div>
                <Link
                    to={config.Routes.shop}
                    state={{
                        category: categoryName,
                    }}
                >
                    <Button variant="text" className="h-fit">
                        {t('seeAll')}
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading
                    ? Array(itemsPerPage)
                          .fill(constants.initObjectProduct)
                          .map((item, index) => {
                              const indexDive = (index % 4) / 10;
                              return <Card key={index} itemProduct={item} loading={isLoading} delay={indexDive} />;
                          })
                    : products.map((item, index) => {
                          const indexDive = (index % 4) / 10;

                          return <Card key={index} itemProduct={item} loading={isLoading} delay={indexDive} />;
                      })}
            </div>
            {!isLoading && products.length === 0 && (
                <div className="size-full flex m-auto justify-center text-xl font-medium bg-white py-20 rounded-b-lg">
                    {t('noProductRelated')}
                </div>
            )}
        </section>
    );
};

export default RelatedProduct;
