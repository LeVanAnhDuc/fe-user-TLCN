import { SvgIconComponent } from '@mui/icons-material';
import AnimationTran from '../../../components/AnimationTran';
interface IProps {
    icon: SvgIconComponent;
    data?: number;
    content: string;
    color?: string;
    delay?: number;
}

const CardStatictis = (props: IProps) => {
    const { content, data, color = 'bg-orange-200', icon: Icon, delay = 0 } = props;
    return (
        <AnimationTran
            tranY={-50}
            delay={delay}
            className="h-fit bg-white rounded-lg grid grid-cols-3 items-center gap-5 p-4"
        >
            <div className="h-18 w-18 border-2 border-gray-100 rounded-full flex items-center justify-center">
                <div className={`${color} rounded-full p-3`}>
                    <Icon />
                </div>
            </div>
            <div className="col-span-2 space-y-1 font-medium">
                <div className="text-xl">{data}</div>
                <div className="text-sm ">{content}</div>
            </div>
        </AnimationTran>
    );
};

export default CardStatictis;
