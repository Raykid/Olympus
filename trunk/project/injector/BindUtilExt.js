import { bindMessage, bindResponse } from '../bind/UtilsExt';
/**
 * 编译bindMessage命令，不会中止编译
 */
export function compileMessage(mediator, currentTarget, target, envModels, type, name, exp, observable) {
    bindMessage(mediator, currentTarget, target, envModels, type, name, exp, observable);
}
/**
 * 编译bindResponse命令，不会中止编译
 */
export function compileResponse(mediator, currentTarget, target, envModels, type, name, exp, observable) {
    bindResponse(mediator, currentTarget, target, envModels, type, name, exp, observable);
}
