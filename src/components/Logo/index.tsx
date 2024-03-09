import { Link } from 'react-router-dom';
import config from '../../config';

interface Iprops {
    className?: string;
}
const Logo = (props: Iprops) => {
    const { className, ...passProps } = props;
    return (
        <Link
            to={config.Routes.home}
            className={`text-black tracking-[0.5rem] text-5xl font-bold font-mono dark:text-white`}
            {...passProps}
        >
            <span className={`${className}`}>DUCK</span>
        </Link>
    );
};

export default Logo;
