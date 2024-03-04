import Rating from '@mui/material/Rating';

import Image from '../Image';
import Ireview from '../../interface/review';
import AnimationTran from '../AnimationTran';
interface Iprops {
    item: Ireview;
    delay: number;
}

const Review = (props: Iprops) => {
    const { delay } = props;
    const { content, stars, createdDate, user, sku } = props.item;

    return (
        <AnimationTran tranY={100} delay={delay} className="flex relative px-5 py-3 gap-5 shadow">
            <Image src={user.avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full  my-3" />
            <div>
                <div className="font-medium">{user.username}</div>
                <Rating value={stars} precision={0.1} readOnly size="small" />
                <div className="text-gray-500 text-sm">
                    {createdDate} | Phân loại:&nbsp;{sku}
                </div>
                <div className="leading-6 mt-3">{content}</div>
            </div>
        </AnimationTran>
    );
};

export default Review;
