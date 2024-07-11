// libs
import HorizontalRule from '@mui/icons-material/HorizontalRule';
import Add from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
// components
import Button from '@/components/Button';

const ChangeQuantity = ({
    quantity,
    setQuantity,
    quantityAvailableItem,
}: {
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    quantityAvailableItem: number;
}) => {
    const { t } = useTranslation('detailProduct');

    const [disableDecrease, setDisableDecrease] = useState<boolean>(false);
    const [disableIncrease, setDisableIncrease] = useState<boolean>(false);

    const handleDecrease = useCallback(() => {
        setQuantity((prev) => {
            if (prev - 1 <= 0) {
                return prev;
            } else {
                return prev - 1;
            }
        });
    }, []);

    const handleIncrease = () => {
        quantity < quantityAvailableItem && setQuantity((prev) => prev + 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        quantity < quantityAvailableItem && setQuantity(+e.target.value);
    };

    useEffect(() => {
        quantity <= 1 ? setDisableDecrease(true) : setDisableDecrease(false);

        quantity >= quantityAvailableItem ? setDisableIncrease(true) : setDisableIncrease(false);

        if (quantityAvailableItem < quantity && quantity > 0 && quantityAvailableItem > 0) {
            setQuantity(quantityAvailableItem);
            toast.error(t('insufficientProduct'));
        }
    }, [quantity, quantityAvailableItem]);

    return (
        <div className="flex place-items-center gap-2">
            <Button variant="text" onClick={handleDecrease} disabled={disableDecrease} className="!p-0 !border-0">
                <HorizontalRule />
            </Button>
            <input
                className="rounded border-2 p-1.5 w-20 text-center bg-white/60  focus:border-primary-700 dark:bg-dark-300"
                value={quantity}
                onChange={handleChange}
            />
            <Button
                disabled={disableIncrease}
                className="!p-0 !border-0"
                variant="text"
                size="small"
                onClick={handleIncrease}
            >
                <Add />
            </Button>
        </div>
    );
};

export default ChangeQuantity;
