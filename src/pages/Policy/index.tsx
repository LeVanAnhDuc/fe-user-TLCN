const Policy = () => {
    return (
        <section className="sm:w-10/12 w-11/12 flex flex-col m-auto py-10 space-y-20">
            <div className="text-4xl font-bold text-center">Phương thức thanh toán</div>
            <div className="space-y-8">
                <div className="font-bold text-lg italic">
                    Khách hàng có thể tham khảo các phương thức thanh toán sau đây và lựa chọn áp dụng phương thức phù
                    hợp:
                </div>
                <ul className="pl-5 space-y-2">
                    <li>Cách 1: Thanh toán khi nhận hàng (COD – giao hàng và thu tiền tận nơi).</li>
                    <li>Cách 2: Thanh toán trực tuyến thông qua thẻ tín dụng quốc tế.</li>
                    <li>
                        Cách 3: Thanh toán trực tuyến thông qua thẻ ngân hàng trong nước có đăng kí Internet Banking.
                    </li>
                    <li>Cách 4: Thanh toán qua các ví điện tử (MoMo, ZaloPay, ShopeePay, VNPay).</li>
                </ul>
                <div className="font-bold text-lg italic">
                    TEELAB sẽ xác nhận việc đặt hàng với Quý khách bằng hình thức nhắn tin qua số điện thoại hoặc gửi
                    thông tin qua email Quý khách cung cấp.
                </div>
            </div>
        </section>
    );
};

export default Policy;
