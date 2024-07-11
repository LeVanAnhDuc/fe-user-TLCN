// libs
import HorizontalRule from '@mui/icons-material/HorizontalRule';
import Add from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react';
// components
import Button from '@/components/Button';
// hooks
import useDebounceCustom from '@/hook/useDebounceCustom';

const QuantityProduct = ({
    valueQuantity,
    idItem,
    handleChangeItemQuantity,
    productQuantityFull,
}: {
    valueQuantity: number;
    idItem: number;
    handleChangeItemQuantity: (idItemInCart: number, quantity: number) => Promise<void>;
    productQuantityFull: {
        id: number;
        quantityAvailable: number;
    };
}) => {
    const [quantity, setQuantity] = useState<number>(valueQuantity);
    const [disableDecrease, setDisableDecrease] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorInput, setErrorInput] = useState<boolean>(false);

    const handleDecrease = useCallback(() => {
        setQuantity((prev) => {
            if (prev - 1 <= 0) {
                return prev;
            } else {
                return prev - 1;
            }
        });
        setIsLoading(true);
    }, []);

    const handleIncrease = useCallback(() => {
        setQuantity((prev) => prev + 1);
        setIsLoading(true);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(+e.target.value);
        setIsLoading(true);
    }, []);

    const debounce = useDebounceCustom(quantity.toString(), 300);

    useEffect(() => {
        isLoading && handleChangeItemQuantity(idItem, +debounce);
        +debounce <= 1 ? setDisableDecrease(false) : setDisableDecrease(true);
        return () => setIsLoading(false);
    }, [debounce]);

    useEffect(() => {
        productQuantityFull && quantity > productQuantityFull.quantityAvailable
            ? setErrorInput(true)
            : setErrorInput(false);
    }, [productQuantityFull, quantity]);

    return (
        <div className="space-y-1">
            {errorInput && <span className="text-red-500 font-semibold text-xs">Số lượng không đủ</span>}
            <div className="flex place-items-center gap-2">
                <Button
                    variant="text"
                    onClick={handleDecrease}
                    disabled={disableDecrease ? false : true}
                    className="!p-0 !border-0"
                >
                    <HorizontalRule fontSize="small" />
                </Button>
                <input
                    className={`${
                        errorInput ? 'border-red-500 text-red-500' : ''
                    } rounded border-2 px-1 py-1 w-[50px] text-center dark:bg-dark-300`}
                    value={quantity}
                    onChange={handleChange}
                />
                <Button className="!p-0" variant="text" size="small" onClick={handleIncrease}>
                    <Add fontSize="small" />
                </Button>
            </div>
        </div>
    );
};

export default QuantityProduct;
