import IconSearch from '@mui/icons-material/Search';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import config from '../../config';

interface Iprops {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setDoneSearch?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = (props: Iprops) => {
    const { search, setSearch, setDoneSearch } = props;
    const locationRouter = useLocation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value as string);
    };

    const handleSubmitSearch = () => {
        setDoneSearch && setDoneSearch(true);
    };

    useEffect(() => {
        if (!search.trim()) {
            setSearch('');
            locationRouter.pathname === config.Routes.shop && setDoneSearch && setDoneSearch(true);
            return;
        }
    }, [search]);

    return (
        <div className="relative h-fit w-full text-gray-600 flex items-center">
            <input
                type="search"
                className="border-y-2 border-l-2 border-gray-300 bg-white h-10 w-full px-3 py-2 rounded-l-xl text-sm focus:border-primary-900 dark:focus:border-primary-300"
                placeholder="Tìm kiếm sản phẩm..."
                required
                value={search}
                onChange={handleChange}
            />
            <button
                type="submit"
                className="h-10 w-14 bg-primary-600 flex justify-center items-center rounded-r-xl dark:bg-primary-300"
                onClick={handleSubmitSearch}
            >
                <IconSearch className="text-white dark:text-dark-600" />
            </button>
        </div>
    );
};

export default Search;
