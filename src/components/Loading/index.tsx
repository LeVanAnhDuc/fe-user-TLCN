import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="size-full flex justify-center items-center gap-5">
            <motion.span
                className="block size-5 rounded-full bg-primary-600"
                animate={{ y: [0, 10, 20, 10, 0] }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.span
                className="block size-5 rounded-full bg-primary-600"
                animate={{ y: [10, 20, 10, 0, 5] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.span
                className="block size-5 rounded-full bg-primary-600"
                animate={{ y: [20, 10, 0, 10, 20] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}
