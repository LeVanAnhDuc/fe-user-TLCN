import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { ChangeEvent, useState } from 'react';

import S2Baner1 from '../../../../assets/img/LandingPage/section-2-1.png';
import Image from '../../../../components/Image';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const UploadImage = () => {

    // handle change image
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
        //   toast
        // call api update anh
        //
        //
        //
    };
    return (
        <>
           <div className="w-full">
                <Button component="label" variant="text" fullWidth sx={{ borderRadius: '100%' }}>
                    <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                    <Image src={selectedImage || S2Baner1} className="w-2/3 md|h-44 h-[172px] rounded-[100%]" />
                </Button>
            </div>
        </>
    );
};

export default UploadImage;
