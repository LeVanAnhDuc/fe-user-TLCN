// libs
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Close from '@mui/icons-material/Close';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// types
import ICategory from '@/types/category';
// components
import Button from '@/components/Button';
import FilterProduct from '../FilterProduct';

const DrawerFilterProduct = ({
    filterSortBy,
    setFilterSortBy,
    loadingAPIGetCategories,
    categories,
    cateFilter,
    setCateFilter,
    setPage,
    openMenuFilterResponsive,
    setOpenMenuFilterResponsive,
}: {
    filterSortBy: string;
    setFilterSortBy: React.Dispatch<React.SetStateAction<string>>;
    loadingAPIGetCategories: boolean;
    categories: ICategory[];
    cateFilter: string[];
    setCateFilter: React.Dispatch<React.SetStateAction<string[]>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    openMenuFilterResponsive: boolean;
    setOpenMenuFilterResponsive: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { t } = useTranslation('shop');

    const toggleMenu = useCallback(() => {
        setOpenMenuFilterResponsive((prev) => !prev);
    }, []);

    return (
        <>
            <div className="block xl:hidden fixed top-20 right-0 z-50 ">
                <Button variant="fill" onClick={toggleMenu}>
                    <div className="text-lg normal-case">{t('filterProduct')}</div>
                </Button>
            </div>
            <Drawer anchor="top" open={openMenuFilterResponsive} onClose={toggleMenu}>
                <div className="h-screen px-5 space-y-3">
                    <div className="flex justify-between items-center my-5">
                        <span className="text-2xl font-bold tracking-wide">{t('filterProduct')}</span>
                        <Fab color="error" size="small">
                            <Close onClick={toggleMenu} />
                        </Fab>
                    </div>
                    <FilterProduct
                        {...{
                            filterSortBy,
                            setFilterSortBy,
                            loadingAPIGetCategories,
                            categories,
                            cateFilter,
                            setCateFilter,
                            setPage,
                        }}
                    />
                </div>
            </Drawer>
        </>
    );
};

export default DrawerFilterProduct;
