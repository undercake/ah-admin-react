
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

interface FormSelectProps {
    label: string,
    value: any,
    options: { label: string, value: string | number }[]
    id: string;
    name: string;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
    helperColor?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
    required?: boolean;
    helperText?: string;
    onChange?: (e: any) => void;
    sx?: any;
    inputSx?: any;
    children?: React.ReactNode;
    error?: boolean;
    fullWidth?: boolean;
    variant?: 'standard' | 'filled' | 'outlined' | undefined;
    size?: 'small' | 'medium' | 'large' | undefined;
    className?: string;
    selectClassName?: string;
    multiline?: boolean;
    [key: string]: any;
}

function FormSelect({
    options,
    label,
    id,
    name,
    children,
    required = false,
    error = false,
    color = 'primary',
    onChange = () => { },
    fullWidth = false,
    variant = "outlined",
    helperText = '',
    helperColor = 'primary',
    sx = {},
    value = '',
    className = '',
    selectClassName = '',
    labelClassName = '',
    selectSx = {},
    size = 'small',
    multiline = false,
    margin = '.5rem',
    ...e
}: FormSelectProps) {
    return (
        <FormControl sx={{
            marginTop: margin,
            marginBottom: margin,
            minWidth: 120,
            '& fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: error ? 'rgb(240, 83, 83)' : 'rgb(107 114 128 / 500)'
                },
            '.dark & fieldset.MuiOutlinedInput-notchedOutline': {
                borderColor: error ? 'rgb(240, 83, 83)' : 'rgb(107 114 128 / 200)'
                },
            '& svg': {
                color: 'rgb(107 114 128 / 500)'
                },
            '.dark & svg': {
                color: 'rgb(107 114 128 / 200)'
                },
            ...sx
            }} required={required} fullWidth={fullWidth} variant={variant} color={color} className={'my-form-control-input ' + className}>
            <InputLabel className={"dark:text-gray-50 dark:border-gray-50 " + labelClassName} sx={{ '.dark &': { borderColor: 'rgb(249 250 251)' } }} error={error} htmlFor={`${id}-select`}>{label}</InputLabel>
            <Select
                className={"dark:text-gray-50 " + selectClassName}
                name={name}
                id={`${id}-selector`}
                value={value}
                onChange={onChange}
                label={label}
                error={error}
                size={size as any}
                sx={selectSx}
                {...e}
            >
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText id={`${id}-helper-text`} color={helperColor} error={error}>
                {helperText}
            </FormHelperText>
        </FormControl>);
}

export default FormSelect;