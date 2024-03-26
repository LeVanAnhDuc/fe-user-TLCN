import IconSearch from '@mui/icons-material/Search';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import config from '../../config';

interface Iprops {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setDoneSearch?: React.Dispatch<React.SetStateAction<boolean>>;
    placeholderSearch?: string;
}

const Search = (props: Iprops) => {
    const { search, setSearch, setDoneSearch, placeholderSearch = 'Tìm kiếm sản phẩm...' } = props;
    const locationRouter = useLocation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value as string);
    };

    const handleSubmitSearch = () => {
        setDoneSearch && setDoneSearch(true);
    };

    useEffect(() => {
        if (!search.trim() && locationRouter.pathname === config.Routes.shop && setDoneSearch) {
            setSearch('');
            setDoneSearch(true);
            return;
        }
    }, [search]);

    return (
        <div className="relative h-fit w-full text-gray-600 flex items-center">
            <input
                type="search"
                className={`${
                    setDoneSearch ? 'rounded-l-md border-y-2 border-l-2 py-2' : 'rounded border-2 py-6'
                } border-gray-300 bg-white h-10 w-full px-3 text-sm focus:border-primary-900 dark:bg-dark-400 dark:text-white dark:focus:border-primary-700 dark:border-dark-200`}
                placeholder={placeholderSearch}
                required
                value={search}
                onChange={handleChange}
            />
            {setDoneSearch && (
                <button
                    type="submit"
                    className="h-10 w-14 bg-primary-600 flex justify-center items-center rounded-r-md dark:bg-primary-300"
                    onClick={handleSubmitSearch}
                >
                    <IconSearch className="text-white dark:text-dark-600" />
                </button>
            )}
        </div>
    );
};

export default Search;
