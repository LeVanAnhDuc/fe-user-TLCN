import { forwardRef, useState } from 'react';
// import classNames from 'classnames';

// import images from '../../assets/images';
// import styles from './Image.module.scss';

// fallback: customImage = images.noImage
// fallback: customImage : đổi tên để kh trùng. Gắn mặc định là images.noImage nếu không truyền từ ngoài vào

const Image = forwardRef(({ src, alt, className, fallback: customImage, ...props }, ref) => {
    const [fallback, setFallBack] = useState('');

    const handleError = () => {
        setFallBack(customImage);
    };

    return <img className={className} ref={ref} src={fallback || src} alt={alt} {...props} onError={handleError} />;
});

export default Image;
