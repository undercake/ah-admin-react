import mittBus from './MittBus';

export function info(msg:string) {
    mittBus.emit('msgEmit', {type: 'info', msg});
}

export function success(msg:string) {
    mittBus.emit('msgEmit', {type: 'success', msg});
}

export function warning(msg:string) {
    console.log('warning', msg);
    mittBus.emit('msgEmit', {type: 'warning', msg});
}

export function error(msg:string) {
    mittBus.emit('msgEmit', {type: 'error', msg});
}