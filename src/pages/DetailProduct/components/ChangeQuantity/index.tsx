// libs
import HorizontalRule from '@mui/icons-material/HorizontalRule';
import Add from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react';
// components
import Button from '@/components/Button';

const ChangeQuantity = ({
    quantity,
    setQuantity,
}: {
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const [disableDecrease, setDisableDecrease] = useState<boolean>(true);

    const handleDecrease = useCallback(() => {
        setQuantity((prev) => {
            if (prev - 1 <= 0) {
                return prev;
            } else {
                return prev - 1;
            }
        });
    }, []);

    const handleIncrease = useCallback(() => {
        setQuantity((prev) => prev + 1);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(+e.target.value);
    }, []);

    useEffect(() => {
        +quantity <= 1 ? setDisableDecrease(false) : setDisableDecrease(true);
    }, [quantity]);

    return (
        <div className="flex place-items-center gap-2">
            <Button
                variant="text"
                onClick={handleDecrease}
                disabled={disableDecrease ? false : true}
                className="!p-0 !border-0"
            >
                <HorizontalRule />
            </Button>
            <input
                className="rounded border-2 p-1.5 w-20 text-center bg-white/60  focus:border-primary-700 dark:bg-dark-300"
                value={quantity}
                onChange={handleChange}
            />
            <Button className="!p-0" variant="text" size="small" onClick={handleIncrease}>
                <Add />
            </Button>
        </div>
    );
};

export default ChangeQuantity;
