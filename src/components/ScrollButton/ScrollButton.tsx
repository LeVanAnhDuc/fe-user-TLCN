import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp';
import { useState, useEffect } from 'react';

function ScrollButton() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-20 right-5 z-50">
            {showButton && (
                <button
                    className="rounded-full h-14 w-14 hover:bg-primary-700 bg-primary-500 animate-bounce transition-all"
                    onClick={scrollToTop}
                >
                    <KeyboardDoubleArrowUp sx={{ fontSize: '30px' }} className="!text-white dark:!text-black" />
                </button>
            )}
        </div>
    );
}

export default ScrollButton;
