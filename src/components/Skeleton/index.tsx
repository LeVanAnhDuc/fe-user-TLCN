interface Iprops {
    className?: string;
    fullWidth?: boolean;
    fillFull?: boolean;
}

const index = (props: Iprops) => {
    const { className, fullWidth, fillFull } = props;

    const allClass = `
    ${fullWidth ? 'w-full' : ''} 
    ${fillFull ? 'size-full' : ''} 
    ${className} `;

    return <div className={`${allClass} min-h-2 min-w-2 animate-pulse bg-gray-200 rounded-md dark:bg-dark-500`}></div>;
};

export default index;
