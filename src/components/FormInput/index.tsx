import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import './index.scss';

interface FormInputProps {
    label: string;
    id: string;
    name: string;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
    helperColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
    required?: boolean;
    inputProps?: any;
    helperText?: string;
    onChange?: (e: any) => void;
    sx?: any;
    inputSx?: any;
    autoComplete?: string;
    children?: React.ReactNode;
    error?: boolean;
    fullWidth?: boolean;
    variant?: 'standard' | 'filled' | 'outlined' | undefined;
    [key: string]: any;
}

function FormInput({
        label,
        id,
        name,
        children,
        autoComplete = name,
        required     = false,
        error        = false,
        color        = 'primary',
        onChange     = () => { },
        inputProps   = {},
        fullWidth    = false,
        variant      = "outlined",
        helperText   = '',
        helperColor  = 'primary',
        sx           = {},
        inputSx      = {},
        size         = 'large',
        ...e
    }: FormInputProps) {
    return (
        <FormControl sx={sx} required={required} fullWidth={fullWidth} variant={variant} color={color} className='my-form-control-input'>
            <InputLabel className="dark:text-gray-50 dark:border-gray-50" sx={{'.dark &': {borderColor: 'rgb(249 250 251)'}}} htmlFor={id} error={error} size={size}>
                {label}
            </InputLabel>
            <OutlinedInput
                className="dark:text-gray-50"
                id={id}
                type="text"
                required
                fullWidth
                name={name}
                autoComplete={autoComplete}
                color={color}
                error={error}
                onChange={onChange}
                label={label}
                // @ts-ignore
                inputprops={inputProps}
                sx={inputSx}
                size={size}
                {...e}
            />
            <FormHelperText id="outlined-weight-helper-text" color={helperColor} error={error}>
                {helperText}
            </FormHelperText>
        </FormControl>);
}

export default FormInput;