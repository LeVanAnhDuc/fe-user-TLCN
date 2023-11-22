import React from 'react';
import BootstrapButton from './BootstrapButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface RatingButtonProps {
  text: string;
}

const RatingButton: React.FC<RatingButtonProps> = ({ text }) => {
  return (
    <div>
      <BootstrapButton className='w-full'>
        <Card sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            height: '32px',
            marginTop: '5px',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 'fit-content',
          }}>
            <CardContent sx={{
              fontSize: '14px', // Kích cỡ chữ 12px
              justifyItems: 'center',
              alignItems: 'center',
              textTransform: 'none', // Chuyển đổi văn bản theo giá trị mặc định
              fontFamily: 'Arial, sans-serif', // Font chữ
            }}>
              {text}
            </CardContent>
          </Box>
        </Card>
      </BootstrapButton>
    </div>
  );
};

export default RatingButton;
