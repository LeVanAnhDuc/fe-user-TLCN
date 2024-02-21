import { motion } from 'framer-motion';
import { ReactElement } from 'react';

interface Iprops {
    className?: string;
    disabled?: boolean;
    children: ReactElement | string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    onClick?: () => Promise<void>;
}
const Button = (props: Iprops) => {
    const { className, disabled = false, children, type = 'button', onClick, ...passProps } = props;
    return (
        <motion.button
            className={`${
                disabled ? 'bg-transparent text-gray-400' : ''
            } border-2  px-5 py-2 rounded-lg text-lg font-medium h-12  ${className} `}
            whileHover={
                !disabled
                    ? {
                          scale: 1.02,
                      }
                    : ''
            }
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            whileTap={!disabled ? { scale: 0.98 } : ''}
            type={type}
            disabled={disabled}
            onClick={onClick}
            {...passProps}
        >
            {children}
        </motion.button>
    );
};

export default Button;
