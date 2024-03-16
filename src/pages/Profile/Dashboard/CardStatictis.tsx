import { SvgIconComponent } from '@mui/icons-material';
import AnimationTran from '../../../components/AnimationTran';
import { Link } from 'react-router-dom';
import config from '../../../config';
interface IProps {
    icon: SvgIconComponent;
    data?: number;
    content: string;
    className?: string;
    delay?: number;
    link?: string;
    status?: string;
}

const CardStatictis = (props: IProps) => {
    const {
        content,
        data,
        className = 'bg-orange-200',
        icon: Icon,
        delay = 0,
        link = config.Routes.home,
        status = '',
    } = props;
    return (
        <AnimationTran tranY={-50} delay={delay}>
            <Link
                to={link}
                state={{ status: status }}
                className=" bg-white rounded-lg grid grid-cols-3 items-center gap-5 p-4 transition hover:-translate-y-1 dark:bg-dark-600"
            >
                <div
                    className={`${className} size-full  border-2 border-gray-100 rounded-full flex items-center justify-center`}
                >
                    <Icon />
                </div>
                <div className="col-span-2 space-y-1 font-medium">
                    <div className="text-xl">{data}</div>
                    <div className="text-sm ">{content}</div>
                </div>
            </Link>
        </AnimationTran>
    );
};

export default CardStatictis;
