import Popover from '@mui/material/Popover';
import { ReactNode, useState } from 'react';
import Button from '../Button';
interface Iprops {
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel?: () => void;
    children: ReactNode;
}

const PopConfirm = (props: Iprops) => {
    const { title, content, onConfirm, onCancel, children } = props;

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [position, setPosition] = useState<HTMLElement | null>(null);

    const handleConfirm = () => {
        setIsVisible(false);
        onConfirm();
    };

    const handleCancel = () => {
        setIsVisible(false);
        setPosition(null);
        onCancel && onCancel();
    };

    const handleOpenConfirm = (event: React.MouseEvent<HTMLElement>) => {
        setPosition(event.currentTarget);
        setIsVisible(true);
    };

    return (
        <>
            <div className="cursor-pointer" onClick={handleOpenConfirm}>
                {children}
            </div>

            <Popover
                open={isVisible}
                anchorEl={position}
                onClose={handleCancel}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <div className="p-3">
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm">{content}</div>
                    <div className="flex items-center justify-end gap-3 mt-5">
                        <Button size="small" onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button
                            variant="fill"
                            size="small"
                            className="bg-red-500 hover:bg-red-700"
                            onClick={handleConfirm}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </Popover>
        </>
    );
};

export default PopConfirm;
