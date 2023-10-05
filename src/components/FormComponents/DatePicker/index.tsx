import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import FormControl from '@mui/material/FormControl';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface Props {
    value     : any,
    onChange  : any
    className?: string,
    type     ?: 'date' | 'time' | 'datetime',
    label    ?: string,
    size     ?: "small" | "medium" | "large",
    margin   ?: string;
    required ?: boolean,
    sx       ?: any,
    fullWidth?: boolean,
    variant  ?: 'standard' | 'filled' | 'outlined' | undefined,
    color    ?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined,
    error    ?: boolean
}

export default function LocalizationDayjs({ value,
    type = 'date',
    onChange,
    className = '',
    label     = '',
    size      = 'small',
    margin    = '.5rem',
    required  = false,
    sx        = {},
    fullWidth = false,
    variant   = 'outlined',
    color     = 'primary',
    error     = false
}: Props) {

    return (
        <LocalizationProvider dateAdapter = {AdapterDayjs} adapterLocale = 'zh-cn'>
            <div         className = "w-full">
                <FormControl sx        = {{
                        marginTop                                   : margin,
                        marginBottom                                : margin,
                        '& fieldset.MuiOutlinedInput-notchedOutline': {
                            borderColor: error ? 'rgb(240, 83, 83)': 'rgb(107 114 128 / 500)'
                        },
                        '.dark & fieldset.MuiOutlinedInput-notchedOutline': {
                            borderColor: error ? 'rgb(240, 83, 83)': 'rgb(107 114 128 / 200)'
                        },
                        '.dark & label': {
                            color: error ? 'rgb(240, 83, 83)': '#ccc'
                        },
                        '.dark & input': {
                            color: error ? 'rgb(240, 83, 83)': '#ccc'
                        },
                        '.dark & svg': {
                            color: error ? 'rgb(240, 83, 83)': '#ccc'
                        },
                        ...sx
                    }} required={required} fullWidth={fullWidth} variant={variant} color={color} className={'my-form-control-input ' + className}>
                        {/* @ts-ignore */}
                        {(type === 'time') && <TimePicker slotProps={{ textField: { size } }} label={label} format="hh:mm" value={dayjs(value)} onChange={onChange} />}
                        {/* @ts-ignore */}
                        {(type === 'date') && <DatePicker slotProps={{ textField: { size } }} label={label} format="YYYY-MM-DD" value={dayjs(value)} onChange={onChange} />}
                        {/* @ts-ignore */}
                        {(type === 'datetime') && <DateTimePicker slotProps={{ textField: { size } }} label={label} format='YYYY-MM-DD hh:mm' value={value} onChange={onChange} />}
                </FormControl>
            </div>
        </LocalizationProvider>
    );
}