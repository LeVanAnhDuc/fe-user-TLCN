import { motion } from 'framer-motion';
import { ReactElement, ReactNode } from 'react';
import { TailSpinIcon } from '../../assets/icon';

interface Iprops {
    className?: string;
    variant?: 'fill' | 'text' | 'outline' | 'outlineBlur';
    size?: 'large' | 'medium' | 'small';
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    children: ReactElement | string | ReactNode;
    type?: 'button' | 'submit' | 'reset' | undefined;
    onClick?: () => Promise<void> | void;
}
const Button = (props: Iprops) => {
    const {
        className,
        variant = 'text',
        size,
        fullWidth,
        disabled = false,
        loading = false,
        children,
        type = 'button',
        onClick,
        ...passProps
    } = props;

    const checkActiveAnimation = !disabled && !loading;

    const allClass = `
        ${disabled ? '!bg-transparent !text-gray-400 border-2 !border-gray-400' : ''} 
        ${loading ? '!bg-gray-300 !text-gray-400 border-2 !border-gray-400' : ''} 
        ${fullWidth ? 'w-full' : ''} 
        ${size === 'small' ? 'h-8 text-sm px-2' : ''} 
        ${size === 'medium' ? 'h-12 text-base' : ''} 
        ${size === 'large' ? 'h-16 text-lg px-6' : ''} 
        ${variant === 'fill' ? 'bg-primary-400 text-white' : ''} 
        ${variant === 'text' ? 'bg-transparent hover:text-primary-800' : ''} 
        ${variant === 'outline' ? 'bg-transparent text-primary-700 border-primary-700 border-2' : ''} 
        ${variant === 'outlineBlur' ? 'bg-white/80 text-primary-700 border-primary-700 border-2' : ''} 
        ${className} `;

    return (
        <motion.button
            className={`
            rounded-lg text-lg font-medium h-12 px-4 flex place-content-center place-items-center relative ${allClass}`}
            whileHover={
                checkActiveAnimation
                    ? {
                          scale: 1.015,
                      }
                    : ''
            }
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            whileTap={checkActiveAnimation ? { scale: 0.985 } : ''}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            {...passProps}
        >
            {loading && <TailSpinIcon className="absolute inset-y-0 inset-x-0 m-auto h-5/6 w-full " color="#00bcd4" />}
            {children}
        </motion.button>
    );
};

export default Button;
