import React, { useEffect, useState } from 'react';

import CardComp from '../../components/Card';
import { getAllProductWithinPagination } from '../../apis/productApi';
import IProduct from '../../interface/product';

import Pagination from '@mui/material/Pagination';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentPasteSearch from '@mui/icons-material/ContentPasteSearch';

import { toast } from 'react-toastify';

function Listproducts() {
    // handle scroll to fix header
    const [scroll, setScroll] = useState(false);
    const listenScrollEvent = () => {
        window.scrollY > 120 ? setScroll(true) : setScroll(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', listenScrollEvent);
        return () => {
            window.removeEventListener('scroll', listenScrollEvent);
        };
    }, []);
    // change page
    const [data, setData] = useState<Array<IProduct>>([]); // Dữ liệu từ API
    const [page, setPage] = useState<number>(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState<number>(0); // Tổng số trang
    const [totalProducts, setTotalProducts] = useState<number>(0); // Tổng số san pham
    const itemsPerPage = 50;

    const getAllProducts = async (pageNo: number) => {
        try {
            const response = await getAllProductWithinPagination(pageNo, itemsPerPage);
            const { content, totalPages, totalElements } = response.data;

            setData(content);
            setTotalPages(totalPages);
            setTotalProducts(totalElements);
        } catch (error) {
            toast.error('Đang bảo trì quay lại sau');
        }
    };

    useEffect(() => {
        getAllProducts(page);
    }, [page]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        window.scrollTo(0, 0);
        setPage(newPage);
    };
    // handle menu
    const [openMenu, setOpenMenu] = useState(false);

    const toggleMenu = () => () => {
        setOpenMenu((prev) => !prev);
    };

    return (
        <>
            <div className="w-10/12 m-auto pt-32">
                {/* start section 1 */}
                <div
                    className={`${
                        scroll ? 'fixed duration-200 ease-in top-18 left-0 w-full ' : ' grid-cols-2'
                    }   z-50 grid bg-transparen`}
                >
                    <strong className={`${scroll ? 'hidden' : ''} `}>
                        Đang hiển thị {itemsPerPage} trong {totalProducts} sản phẩm
                    </strong>
                    <div className={`${scroll ? ' flex justify-end' : 'w-full flex justify-end'}`}>
                        <Button variant="contained" onClick={toggleMenu()}>
                            <div className="text-lg normal-case">Lọc sản phẩm</div>
                        </Button>
                    </div>
                </div>
                {/* end section 1 */}
                {/* start section 2 */}
                <div className="h-full">
                    {/* start navigation  */}
                    <Drawer anchor="right" open={openMenu} onClose={toggleMenu()}>
                        {/* Start Select Gender */}
                        {/* <div className="w-96">
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Gender</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="All" />
                                        <FormControlLabel control={<Checkbox />} label="Men" />
                                        <FormControlLabel control={<Checkbox />} label="Women" />
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </div> */}
                        {/* End Select Gender */}
                        {/* Start Select Category */}
                        <div>
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Category</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="All" />
                                        <FormControlLabel control={<Checkbox />} label="Shoes" />
                                        <FormControlLabel control={<Checkbox />} label="Sandal" />
                                        <FormControlLabel control={<Checkbox />} label="T-Shirts" />
                                        <FormControlLabel control={<Checkbox />} label="Trousers" />
                                        <FormControlLabel control={<Checkbox />} label="Dress" />
                                        <FormControlLabel control={<Checkbox />} label="Accessory" />
                                        <FormControlLabel control={<Checkbox />} label="Backpack" />
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* End Select Category */}
                        {/* Start Select Filter */}
                        <div>
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Filter</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox />} label="Price high to low" />
                                        <FormControlLabel control={<Checkbox />} label="Price low to high" />
                                        <FormControlLabel control={<Checkbox />} label="Latest" />
                                        <FormControlLabel control={<Checkbox />} label="Many reviews" />
                                        <FormControlLabel control={<Checkbox />} label="High stars" />
                                    </FormGroup>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* End Select Filter */}
                    </Drawer>
                    {/* end navigation  */}
                    {/* start list item */}
                    <div className="col-span-5 px-3 xl:col-span-4 ">
                        {data.length !== 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {data.map((item, index) => (
                                    <CardComp key={index} itemProduct={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center pt-20 text-xl  text-gray-400 gap-5">
                                <ContentPasteSearch sx={{ fontSize: '100px' }} />
                                Hix. Không có sản phẩm nào. Bạn thử tắt điều kiện lọc và tìm lại nhé?
                            </div>
                        )}
                    </div>
                    {/* end list item */}
                </div>
                {/* end section 2 */}
                {/* start section 3 */}
                <div className="w-full flex justify-center my-10">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        boundaryCount={1}
                    />
                </div>
                {/* end section 3 */}
            </div>
        </>
    );
}

export default Listproducts;
