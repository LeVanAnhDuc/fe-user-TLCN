import { motion } from 'framer-motion';
import { ReactElement, ReactNode } from 'react';
interface Iprops {
    className?: string;
    children?: ReactElement | JSX.Element | string | ReactNode;
    scale?: number;
    opacity?: number;
    delay?: number;
    duration?: number;
}
const AnimationScale = (props: Iprops) => {
    const { className, children, scale = 0.2, opacity = 0, delay = 0, duration = 1 } = props;
    return (
        <motion.div
            initial={{ scale: scale, opacity: opacity }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: duration, delay: delay, ease: 'backOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default AnimationScale;
