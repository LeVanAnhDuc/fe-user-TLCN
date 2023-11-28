import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import useDebounceCustom from '../../hook/useDebounceCustom';
interface Iprops {
    setSearch?: React.Dispatch<React.SetStateAction<string>>;
    setDoneSearch?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = (props: Iprops) => {
    const { setSearch, setDoneSearch } = props;

    const [valueSearch, setValueSearch] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValueSearch(e.target.value);
    };
    const handleSubmitSearch = () => {
        setDoneSearch && setDoneSearch(true);
    };
    // optimize
    // handle set thời gian chờ để tránh việc nhập 1 kí tự sẽ loading liên tục
    const debounce = useDebounceCustom(valueSearch, 300);
    useEffect(() => {
        // Nếu không có dữ liệu sẽ không call API
        if (!debounce.trim()) {
            setSearch && setSearch('');
            return;
        }
        setSearch && setSearch(debounce);
    }, [debounce]);

    return (
        <div className="w-full relative ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon sx={{ color: 'gray' }} />
            </div>
            <input
                type="search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Tìm kiếm sản phẩm bạn cần..."
                required
                value={valueSearch}
                onChange={handleChange}
            />
            <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSubmitSearch}
            >
                Tìm
            </button>
        </div>
    );
};

export default Search;
