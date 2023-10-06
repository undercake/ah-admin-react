  /*
* @Author      : Undercake
* @Date        : 2023-05-17 03: 24: 41
 * @LastEditTime: 2023-10-06 15:19:06
 * @FilePath: /ah-admin-react/src/components/EditDialogs/Core/index.tsx
* @Description : edit core Drawer
*/
import { type ReactNode, useEffect } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ScrollView from '../../../components/ScrollView';
import Header from './Header';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormInput from '../../../components/FormComponents/FormInput';
import FormSelect from '../../../components/FormComponents/Select';
import DatePicker from '../../../components/FormComponents/DatePicker';
import { FormEventHandler } from 'react';
import Error from '../../Status/Error';
import Loading from '../../Status/Loading';

type colors = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | undefined;
export interface types {
    [key: string]: {
        type     : 'input' | 'select' | 'date' | 'datetime' | 'time' | 'image' | 'avatar' | 'textfield';
        required : boolean;
        label    : string;
        options ?: { label: string, value: string | number }[];
        related ?: ((v: string) => void)[];
    };
}
interface props {
    children    ?: ReactNode;
    onClose      : any;
    onOpen       : any;
    open         : boolean;
    handleSubmit : (e: SubmitEvent) => void
    onChange     : (val: string | number, name: string) => void;
    colors       : { [key: string]: colors },
    formData     : { [key: string]: any };
    helperText   : { [key: string]: string };
    types        : types;
    errors       : string[];
    refreshText ?: string;
    refresh     ?: () => void;
    title       ?: string;
    error       ?: boolean;
    loading     ?: boolean;
}

export interface CoreState {
    open    : boolean;
    colors  : {
        [key:string]: colors
    };
    helperText: {
        [key:string]: string;
    };
    errors: string[];
};

function EditCore({
    onClose,
    onOpen,
    open,
    handleSubmit,
    onChange,
    types,
    colors,
    formData,
    helperText,
    errors,
    refresh     = ()=>{},
    refreshText = '刷新',
    children    = null,
    loading     = false,
    error       = false,
    title       = '修改'
}: props) {
    useEffect(()=>{
        const keys = Object.keys(colors);
        if (keys.length <= 0) return;
        const selector = formData[keys[0]] === '' ? '.InputDialog' + keys[0] : '.InputDialog' + keys[0] + ' label';
        document.querySelector(selector)?.scrollIntoView({behavior: 'smooth'});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colors]);

    return (
        <SwipeableDrawer
            PaperProps = {{ className: 'dark:bg-gray-1080 dark:text-gray-100 p-4' }}
            anchor     = 'right'
            open       = {open}
            onClose    = {onClose}
            onOpen     = {onOpen}
        >
            <Header onClick = {(e: Event) => { onClose(e, 'button') }} title = {title} />
            {error ? <Box sx={{minWidth: '25rem', textAlign: 'center'}}><Error /> <Button onClick={refresh}>{refreshText}</Button></Box> : loading ? <Box sx={{minWidth: '25rem', textAlign: 'center'}}><Loading /></Box> :
                <ScrollView sx={{marginTop: '1.5rem'}}>
                <Box component = "form" onSubmit = {handleSubmit as unknown as FormEventHandler<HTMLFormElement>} noValidate sx = {{ pt: 1, maxWidth: '50rem' }}>
                    {
                        Object.keys(types).map((key: string) => {
                            const item = types[key];
                            const onCh = (e: Event | string) => {
                                  // @ts-ignore
                                const v = typeof e == 'string' ? e : e.target.value;
                                onChange(v, key);
                                item.related?.forEach((func) => func(v));
                            };
                            const InputProps = {
                                label      : item.label,
                                id         : `edit-employee-${key}`,
                                color      : colors[key] as colors,
                                helperColor: colors[key] as colors,
                                className  : 'InputDialog' + key,
                                name       : key,
                                required   : item.required,
                                variant    : "outlined" as "outlined",
                                error      : errors.includes(key) ? true : false,
                                helperText : helperText[key],
                                onChange   : onCh,
                                size       : 'small' as "small" | "medium" | "large" | undefined,
                                margin     : '.8rem',
                                value      : formData[key] as string | number,
                            };
                            switch (item.type) {
                                case 'input'    : 
                                case 'textfield': 
                                    return (
                                        <FormInput
                                            fullWidth
                                            key = {key}
                                            {...InputProps}
                                            multiline = {item.type === 'textfield'}
                                        />
                                    );
                                case 'select': 
                                    return (
                                        <FormSelect
                                            key = {key}
                                            {...InputProps}
                                            options = {item.options as { label: string, value: string | number }[]}
                                        />
                                    );
                                case 'date'    :
                                case 'time'    :
                                case 'datetime':
                                    return (
                                        <DatePicker
                                            key  = {key}
                                            type = {item.type}
                                            {...InputProps}
                                        />
                                    );
                                  // case 'image':
                                  //     return (
                                  //         <FormImage
                                  //             label       = {item.label}
                                  //             className   = 'mt-4 mb-4'
                                  //             id          = {`edit-employee-${item.label}`}
                                  //             color       = {colors[item.label] as colors}
                                  //             helperColor = {colors[item.label] as colors}
                                  //             name        = {item.label}
                                  //             required    = {item.required}
                                  //             fullWidth
                                  //             variant    = "outlined"
                                  //             error      = {colors[item.label] == 'error'}
                                  //             helperText = {helperText[item.label]}
                                  //             onChange   = {(e) => this.onChange(e, item.label)}
                                  //             value      = {formData[item.label]}
                                  //         />
                                  //     );
                                  // case 'avatar':
                                  //     return (
                                  //         <FormAvatar
                                  //             label       = {item.label}
                                  //             className   = 'mt-4 mb-4'
                                  //             id          = {`edit-employee-${item.label}`}
                                  //             color       = {colors[item.label] as colors}
                                  //             helperColor = {colors[item.label] as colors}
                                  //             name        = {item.label}
                                  //             required    = {item.required}
                                  //             fullWidth
                                  //             variant    = "outlined"
                                  //             error      = {colors[item.label] == 'error'}
                                  //             helperText = {helperText[item.label]}
                                  //             onChange   = {(e) => this.onChange(e, item.label)}
                                  //             value      = {formData[item.label]}
                                  //         />
                                  //     );
                                default: 
                                    return null;
                            }
                        })}
                    {children}
                    <Button
                        fullWidth
                        type      = "submit"
                        variant   = "contained"
                        className = 'bg-purple-dark hover:bg-purple-lighter'
                        color     = "secondary"
                        size      = "large"
                        sx        = {{ mt: 3, mb: 2, border: 0, boxShadow: 0, '&:hover': { border: 0, boxShadow: 0 } }}
                    >
                        提交
                    </Button>
                </Box>
            </ScrollView>}
        </SwipeableDrawer>
    );
}

export default EditCore;