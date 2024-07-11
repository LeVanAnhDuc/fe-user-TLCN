// libs
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
// components
import Button from '@/components/Button';

const ImageCenter = ({
    picColor,
    images,
    currentImageIndex,
    setPicColor,
    setCurrentImageIndex,
}: {
    picColor: string;
    images: string[];
    currentImageIndex: number;
    setPicColor: React.Dispatch<React.SetStateAction<string>>;
    setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const handleNextClick = () => {
        setPicColor('');
        const newIndex = (currentImageIndex + 1) % images.length;
        setCurrentImageIndex(newIndex);
    };

    const handlePreviousClick = () => {
        setPicColor('');
        if (currentImageIndex === 0) {
            setCurrentImageIndex(images.length - 1);
        } else {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    return (
        <div className="lg:col-span-7 xl:col-span-6 lg:h-[33rem] flex gap-1 relative">
            <img
                src={picColor ? picColor : images[currentImageIndex]}
                alt="image"
                className="size-full object-cover object-center rounded-lg"
            />
            <div className="w-full flex justify-end gap-2.5 absolute top-5 -left-5 ">
                <Button variant="outlineBlur" className="!rounded-full !p-3 bg-white/30" onClick={handlePreviousClick}>
                    <>
                        <div className="absolute bg-white size-full rounded-full blur-xl p-7 dark:bg-dark-300"></div>
                        <NavigateBefore className="z-10" />
                    </>
                </Button>
                <Button variant="outlineBlur" className="!rounded-full !p-3 bg-white/30" onClick={handleNextClick}>
                    <>
                        <div className="absolute bg-white size-full rounded-full blur-xl p-7 dark:bg-dark-300"></div>
                        <NavigateNext className="z-10" />
                    </>
                </Button>
            </div>
        </div>
    );
};

export default ImageCenter;
