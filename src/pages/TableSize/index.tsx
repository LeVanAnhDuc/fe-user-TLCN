import images from '../../assets/img';

const TableSize = () => {
    return (
        <section className="sm:w-10/12 w-11/12 flex flex-col m-auto text-center py-10 space-y-7">
            <div className="text-4xl font-bold">Bảng size</div>
            <div className="font-bold text-xl italic">
                Form của DUCK là phong rộng tương đối với người Việt Nam nên không cần thiết phải nhích size
            </div>
            <img src={images.tableSize} alt="Table Size" />
        </section>
    );
};

export default TableSize;
