import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import Stack from '@mui/material/Stack';
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
}: Props) {

    return (
        <LocalizationProvider dateAdapter = {AdapterDayjs} adapterLocale = 'zh-cn'>
            {/* <Stack spacing={3} sx={{ width: 'auto', paddingTop: margin, paddingBottom: margin, display: 'block' }}> */}
            <div         className = "w-full">
            <FormControl sx        = {{ marginTop: margin, marginBottom: margin, ...sx }} required = {required} fullWidth = {fullWidth} variant = {variant} color = {color} className = {'my-form-control-input ' + className}>
                    {(type == 'time') && <TimePicker slotProps={{ textField: { size } }} label={label} format="hh:mm" value={dayjs(value)} onChange={onChange} />}
                    {(type == 'date') && <DatePicker slotProps={{ textField: { size } }} label={label} format="YYYY-MM-DD" value={dayjs(value)} onChange={onChange} />}
                    {(type == 'datetime') && <DateTimePicker slotProps={{ textField: { size } }} label={label} format='YYYY-MM-DD hh:mm' value={value} onChange={onChange} />}
                </FormControl></div>
            {/* </Stack> */}
        </LocalizationProvider>
    );
}