// libs
import { useEffect } from 'react';
// types
import ICategory from '@/interface/category';
// apis
import { getAllCategoryWithPagination } from '@/apis/categoryApii';

const GetCategories = ({
    setLoadingAPIGetCategories,
    setCategories,
    setErrorAPI,
}: {
    setLoadingAPIGetCategories: React.Dispatch<React.SetStateAction<boolean>>;
    setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    useEffect(() => {
        const handleGetCategories = async () => {
            try {
                setLoadingAPIGetCategories(true);
                const response = await getAllCategoryWithPagination();
                setLoadingAPIGetCategories(false);

                if (response.status === 200 && Array.isArray(response.data.content)) {
                    setCategories(response.data.content);
                } else {
                    setErrorAPI(true);
                }
            } catch (error) {
                setErrorAPI(true);
            }
        };

        handleGetCategories();
    }, []);

    return null;
};

export default GetCategories;
