import { motion } from 'framer-motion';
import { ReactElement } from 'react';
interface Iprops {
    className?: string;
    children?: ReactElement | JSX.Element | string;
    tranX?: number;
    tranY?: number;
    opacity?: number;
    delay?: number;
    duration?: number;
}
const AnimationTran = (props: Iprops) => {
    const { className = '', children, tranX = 0, tranY = 0, opacity = 0, delay = 0, duration = 1 } = props;
    return (
        <motion.div
            initial={{ x: tranX, y: tranY, opacity: opacity }}
            whileInView={{ x: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ease: 'backOut', duration: duration, delay: delay }}
            className={className ? `${className} ` : ''}
        >
            {children}
        </motion.div>
    );
};

export default AnimationTran;
