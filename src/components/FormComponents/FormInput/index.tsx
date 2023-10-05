import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
// import './index.scss';

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
    size?: 'small' | 'medium' | 'large' | undefined;
    className?: string;
    inputClassName?: string;
    multiline?: boolean;
    [key: string]: any;
}

function FormInput({
    label,
    id,
    name,
    children,
    autoComplete = name,
    required = false,
    error = false,
    color = 'primary',
    onChange = () => { },
    inputProps = {},
    fullWidth = false,
    variant = "outlined",
    helperText = '',
    helperColor = 'primary',
    sx = {},
    className = '',
    inputClassName = '',
    labelClassName = '',
    inputSx = {},
    size = 'small',
    multiline = false,
    minRows = 2,
    type='text',
    margin = '.5rem',
    ...e
}: FormInputProps) {
    return (
        <FormControl sx={{
            marginTop: margin,
            marginBottom: margin,
            '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: error ? 'rgb(240, 83, 83)' : 'rgb(107 114 128 / 500)'
                },
            '.dark & fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: error ? 'rgb(240, 83, 83)' : 'rgb(107 114 128 / 200)'
                },
                '.dark & label': {
                    color: error ? 'rgb(240, 83, 83)': '#ccc'
                },
                ...sx }}
            required={required}
            fullWidth={fullWidth}
            variant={variant}
            color={color}
            className={'my-form-control-input ' + className}
        >
            <InputLabel className={"dark:text-gray-50 dark:border-gray-50 " + labelClassName} sx={{ '.dark &': { borderColor: 'rgb(249 250 251)' }, marginTop: size == 'small' ? '-8px' : '' }} htmlFor={id} error={error}>
                {label}
            </InputLabel>
            <OutlinedInput
                className={"dark:text-gray-50 " + inputClassName}
                id={id}
                type={type}
                required={required}
                fullWidth={fullWidth}
                name={name}
                autoComplete={autoComplete}
                color={color}
                error={error}
                onChange={onChange}
                label={label}
                // @ts-ignore
                inputprops={inputProps}
                sx={inputSx}
                multiline={multiline}
                minRows={multiline ? minRows : 1}
                size={size as any}
                {...e}
            />
            <FormHelperText id={`${id}-helper-text`} color={helperColor} error={error}>
                {helperText}
            </FormHelperText>
        </FormControl>);
}

export default FormInput;