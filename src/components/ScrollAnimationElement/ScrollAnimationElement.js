import React, { useRef, useEffect, useState } from 'react';

function ScrollAnimationElement({ children }) {
    const elementRef = useRef(null);
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const handleScroll = (entries, observer) => {
            entries.forEach((entry) => {
                const target = entry.target;

                // Tải nhiều lần
                // if (entry.isIntersecting) {
                //     // Phần tử nằm trong viewport, thêm lớp để chạy animation
                //     target.classList.add('animate-your-animation-class');
                // } else {
                //     // Phần tử ra khỏi viewport, xóa lớp để reset animation
                //     target.classList.remove('animate-your-animation-class');
                // }

                // Tải 1 lần
                if (entry.isIntersecting && !isAnimated) {
                    // Phần tử nằm trong viewport và chưa được animate
                    target.classList.add('animate-your-animation-class');
                    setIsAnimated(true); // Đánh dấu là đã animate
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px', // Điều này có thể điều chỉnh tùy theo cần thiết
            threshold: 0.5, // Điều chỉnh ngưỡng tùy theo cần thiết
        };

        const observer = new IntersectionObserver(handleScroll, observerOptions);

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isAnimated]);

    // Sử dụng React.cloneElement để truyền ref vào children
    const childrenWithRef = React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
            ref: elementRef,
            key: `custom-key-${index}`,
        });
    });

    return childrenWithRef;
}

export default ScrollAnimationElement;
