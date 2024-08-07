// libs
import { SvgIconComponent } from '@mui/icons-material';
import { Link } from 'react-router-dom';
// components
import AnimationTran from '@/components/AnimationTran';
// others
import config from '@/config';

const CardStatistics = ({
    content,
    data,
    className = 'bg-orange-200',
    icon: Icon,
    delay = 0,
    link = config.Routes.home,
    status = '',
}: {
    icon: SvgIconComponent;
    data?: number;
    content: string;
    className?: string;
    delay?: number;
    link?: string;
    status?: string;
}) => {
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

export default CardStatistics;
