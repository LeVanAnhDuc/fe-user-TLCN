import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface IProps {
    labelInput: string;
    typeInput?: string;
    isRequired?: boolean;
    errorInput: boolean;
    errorFormMessage?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: any;
    autoComplete?: string;
    [key: string]: unknown;
}

const InputText = (propsCh: IProps) => {
    const {
        labelInput,
        typeInput = 'text',
        isRequired = false,
        errorInput,
        errorFormMessage,
        autoComplete,
        register,
        ...props
    } = propsCh;

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <>
            <TextField
                label={labelInput}
                type={showPassword ? 'text' : typeInput}
                fullWidth
                required={isRequired}
                error={errorInput ? true : false}
                autoComplete={autoComplete}
                InputProps={{
                    endAdornment:
                        typeInput === 'password' ? (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ) : (
                            ''
                        ),
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                {...register}
                {...props}
            />
            {errorInput && isRequired === false && (
                <p className="text-red-500" role="alert">
                    {errorFormMessage}
                </p>
            )}
        </>
    );
};

export default InputText;
