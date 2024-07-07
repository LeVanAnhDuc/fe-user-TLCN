// libs
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
// types
import ICategory from '@/interface/category';
// components
import Skeleton from '@/components/Skeleton';
// other
import config from '@/config';

const FilterProduct = ({
    filterSortBy,
    setFilterSortBy,
    loadingAPIGetCategories,
    categories,
    cateFilter,
    setCateFilter,
    setPage,
}: {
    filterSortBy: string;
    setFilterSortBy: React.Dispatch<React.SetStateAction<string>>;
    loadingAPIGetCategories: boolean;
    categories: ICategory[];
    cateFilter: string[];
    setCateFilter: React.Dispatch<React.SetStateAction<string[]>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const { t } = useTranslation('shop');

    const handleGetFilterSortBy = (event: SelectChangeEvent) => {
        setFilterSortBy(event.target.value as string);
        setPage(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSelectCategoryFilter = (e: { target: { name: string } }) => {
        const updatedSelection = cateFilter.includes(e.target.name)
            ? cateFilter.filter((category) => category !== e.target.name)
            : [...cateFilter, e.target.name];

        setCateFilter(updatedSelection);
        setPage(1);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <FormControl className="!rounded-lg" fullWidth variant="filled">
                <InputLabel className="!font-bold !text-lg !rounded-lg">{t('sortBy')}</InputLabel>
                <Select className="!rounded-lg" value={filterSortBy} onChange={handleGetFilterSortBy}>
                    <MenuItem value={config.SearchFilter.random}>{t('notFilter')}</MenuItem>
                    <MenuItem value={config.SearchFilter.favoriteAsc}>{t('likesLowToHigh')}</MenuItem>
                    <MenuItem value={config.SearchFilter.favoriteDesc}>{t('likesHighToLow')}</MenuItem>
                    <MenuItem value={config.SearchFilter.priceAsc}>{t('priceLowToHigh')}</MenuItem>
                    <MenuItem value={config.SearchFilter.priceDesc}>{t('priceHighToLow')}</MenuItem>
                    <MenuItem value={config.SearchFilter.ratingAsc}>{t('ratingLowToHigh')}</MenuItem>
                    <MenuItem value={config.SearchFilter.ratingDesc}>{t('ratingHighToLow')}</MenuItem>
                    <MenuItem value={config.SearchFilter.reviewAsc}>{t('reviewLowToHigh')}</MenuItem>
                    <MenuItem value={config.SearchFilter.reviewDesc}>{t('reviewHighToLow')}</MenuItem>
                </Select>
            </FormControl>

            <Accordion defaultExpanded className="!bg-transparent">
                <AccordionSummary expandIcon={<ExpandMoreIcon />} className="!bg-white dark:!bg-dark-300 !rounded-t-lg">
                    <div className="font-bold">{t('category')}</div>
                </AccordionSummary>
                <AccordionDetails className="!bg-white dark:!bg-dark-300 !rounded-b-lg">
                    <div className="flex flex-col gap-2">
                        {loadingAPIGetCategories
                            ? Array(10)
                                  .fill(null)
                                  .map((_, index) => <Skeleton key={index} className="h-5" />)
                            : categories.map((item, index) => (
                                  <label key={index} className="inline-flex items-center cursor-pointer w-fit">
                                      <input
                                          type="checkbox"
                                          className="h-4 w-4 accent-primary-700 cursor-pointer"
                                          checked={cateFilter.includes(item.name)}
                                          onChange={handleSelectCategoryFilter}
                                          name={item.name}
                                      />
                                      <span className="ml-2 text-sm">{item.name}</span>
                                  </label>
                              ))}
                    </div>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default FilterProduct;
