import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

import { useState } from 'react';

interface Iprops {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any;
    error?: boolean;
}

const InputPassword = (propsCh: Iprops) => {
    const { label, field, error = false, ...props } = propsCh;

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <>
            <FormControl fullWidth variant="outlined">
                <InputLabel>{label}</InputLabel>
                <OutlinedInput
                    {...field}
                    error={error}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={label}
                    {...props}
                />
            </FormControl>
        </>
    );
};

export default InputPassword;
