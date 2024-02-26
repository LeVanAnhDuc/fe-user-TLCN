interface IIcon {
    width?: string;
    height?: string;
    className?: string;
    color?: string;
}

export const TailSpinIcon = (props: IIcon) => {
    const { width = '38', height = '38', className, color = '*fff' } = props;
    return (
        <svg width={width} height={height} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
                <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                    <stop stopColor={color} stopOpacity="0" offset="0%" />
                    <stop stopColor={color} stopOpacity=".631" offset="63.146%" />
                    <stop stopColor={color} offset="100%" />
                </linearGradient>
            </defs>

            <g fill="none" fillRule="evenodd" className="!text-primary-500">
                <g transform="translate(1 1)">
                    <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="5">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <circle fill={color} cx="36" cy="18" r="1">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite"
                        />
                    </circle>
                </g>
            </g>
        </svg>
    );
};
