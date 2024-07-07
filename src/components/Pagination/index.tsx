import PaginationMUI from '@mui/material/Pagination';

const Pagination = ({
    totalPages,
    page,
    setPage,
}: {
    totalPages: number;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <PaginationMUI
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            boundaryCount={1}
        />
    );
};

export default Pagination;
