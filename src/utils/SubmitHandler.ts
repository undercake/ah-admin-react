  /*
 * @Author      : Undercake
 * @Date        : 2023-10-08 15: 49: 59
 * @LastEditTime: 2023-10-09 13:13:59
 * @FilePath: /ah-admin-react/src/utils/SubmitHandler.ts
 * @Description : 
 */
import { type SetStateAction, type Dispatch } from 'react';
import { type ValidationError } from 'yup';
import { type AxiosResponse } from 'axios';
import { type ObjectSchema, type AnyObject } from 'yup';
import mittBus from './MittBus';
import axios from './Axios';

interface SubmitType {
    setState: SetStateAction<any> | { [key in 'colors' | 'helperText' | 'errors']: Dispatch<SetStateAction<any>> };
    tips    : { [key: string]: string };
}

interface YupSubmitErrorHandlerType extends SubmitType {
    err: ValidationError | { msg: string; res: AxiosResponse } | any;
}

interface YupSubmitHandlerType extends SubmitType {
    schema   : ObjectSchema<{ [key: string]: any }, AnyObject, { [key: string]: any }, ''>;
    data     : { [key: string]: any };
    url      : string;
    onSuccess: (d: { code: number; rs: number }) => void;
}

export default function YupSubmitHandler({ schema, setState, tips, data, url, onSuccess = () => {} }: YupSubmitHandlerType) {
    schema
        .validate(data)
        .then(() => axios.post(url, data))
          // @ts-ignore
        .then((d: { code: number; rs: number }) => {
            if (d.code === 0) {
                onSuccess(d);
                mittBus.emit('msgEmit', {
                    type: 'success',
                    msg : '提交成功'
                });
            }
        })
        .catch((err) => {
            console.log(err);
            YupSubmitErrorHandler({
                err,
                setState,
                tips
            });
        });
}

function YupSubmitErrorHandler({ err, setState, tips }: YupSubmitErrorHandlerType) {
    let Errors: {
        colors    : { [key: string]: string };
        helperText: { [key: string]: string };
        errors    : string[];
    };
    if ('params' in err && 'message' in err) {
        let { params, message } = 'inner' in err ? err.inner[0] : err;
        Errors                  = {
            colors    : { [params.path]: 'error' },
            helperText: { [params.path]: message },
            errors    : [params.path]
        };
        mittBus.emit('msgEmit', {
            type: 'warning',
            msg : err.message
        });
    }
    if (err.msg !== undefined) {
        const tip    = tips[err.msg];
              Errors = {
            colors    : { [tip]: 'error' },
            helperText: { [tip]: err.msg },
            errors    : [tip]
        };
    }
      // @ts-ignore
    if (Errors && Errors.hasOwnProperty('errors')) {
        if (typeof setState === 'function') {
            setState(Errors);
        } else {
            ['colors', 'helperText', 'errors'].forEach((k) => {
                setState[k](Errors[k as 'colors' | 'helperText' | 'errors']);
            });
        }
    }
}
