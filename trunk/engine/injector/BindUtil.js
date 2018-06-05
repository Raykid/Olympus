import { bindManager } from "../bind/BindManager";
function getBindParams(currentTarget) {
    var bindParams = currentTarget.__bind_commands__;
    if (!bindParams) {
        bindParams = [];
        Object.defineProperty(currentTarget, "__bind_commands__", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: bindParams
        });
    }
    return bindParams;
}
/**
 * 添加编译命令到显示对象上（正向）
 *
 * @export
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {*} target 编译命令本来所在的对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export function pushCompileCommand(currentTarget, target, cmd) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    // 添加编译指令
    getBindParams(currentTarget).push({ cmd: cmd, target: target, args: args });
}
/**
 * 添加编译命令到显示对象上（反向）
 *
 * @export
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {*} target 编译命令本来所在的对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export function unshiftCompileCommand(currentTarget, target, cmd) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    getBindParams(currentTarget).unshift({ cmd: cmd, target: target, args: args });
}
/**
 * 编译显示对象，会先编译自身，然后再递归编译子对象
 *
 * @export
 * @param {IMediator} mediator 显示对象所属的中介者
 * @param {ICompileTarget} currentTarget 显示对象
 * @param {any[]} [envModels] 环境变量数组
 */
export function compile(mediator, currentTarget, envModels) {
    // 取到编译参数列表
    var bindParams = currentTarget.__bind_commands__;
    // 编译currentTarget自身
    if (bindParams) {
        // 这里没有提前读取出length属性，因为需要动态判断数组长度
        for (var i = 0; i < bindParams.length;) {
            // 使用shift按顺序取出编译命令
            var params = bindParams.shift();
            // 调用编译命令，并且更新中止状态
            params.cmd.apply(params, [mediator, currentTarget, params.target, envModels || []].concat(params.args));
        }
    }
}
/**
 * 编译bindValue命令，不会中止编译
 */
export function compileValue(mediator, currentTarget, target, envModels, name, exp) {
    bindManager.bindValue(mediator, currentTarget, target, envModels, name, exp);
}
/**
 * 编译bindExp命令，不会中止编译
 */
export function compileExp(mediator, currentTarget, target, envModels, exp) {
    bindManager.bindExp(mediator, currentTarget, target, envModels, exp);
}
/**
 * 编译bindFunc命令，不会中止编译
 */
export function compileFunc(mediator, currentTarget, target, envModels, name) {
    var argExps = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        argExps[_i - 5] = arguments[_i];
    }
    bindManager.bindFunc.apply(bindManager, [mediator, currentTarget, target, envModels, name].concat(argExps));
}
/**
 * 编译bindOn命令，不会中止编译
 */
export function compileOn(mediator, currentTarget, target, envModels, type, exp) {
    bindManager.bindOn(mediator, currentTarget, target, envModels, type, exp);
}
function isPosterity(mediator, target, parent) {
    var tempParent = mediator.bridge.getParent(target);
    if (!tempParent)
        return false;
    else if (tempParent === parent)
        return true;
    else
        return isPosterity(mediator, tempParent, parent);
}
function getAllSubTargets(mediator, target) {
    var bindTargets = mediator.bindTargets;
    var subTargets = [];
    for (var _i = 0, bindTargets_1 = bindTargets; _i < bindTargets_1.length; _i++) {
        var bindTarget = bindTargets_1[_i];
        bindTarget && bindTarget.forEach(function (tempTarget) {
            if (isPosterity(mediator, tempTarget, target))
                subTargets.push(tempTarget);
        });
    }
    return subTargets;
}
/**
 * 编译bindIf命令，会中止编译，直到判断条件为true时才会启动以继续编译
 */
export function compileIf(mediator, currentTarget, target, envModels, exp) {
    // 将后面的编译命令缓存起来
    var bindParams = currentTarget.__bind_commands__;
    var caches = [{ target: currentTarget, params: bindParams.splice(0, bindParams.length) }];
    // 后代节点的也要缓存住
    var subTargets = getAllSubTargets(mediator, currentTarget);
    for (var _i = 0, subTargets_1 = subTargets; _i < subTargets_1.length; _i++) {
        var subTarget = subTargets_1[_i];
        var subBindParams = subTarget.__bind_commands__;
        caches.push({ target: subTarget, params: subBindParams.splice(0, subBindParams.length) });
    }
    // 绑定if命令
    var terminated = false;
    bindManager.bindIf(mediator, currentTarget, target, envModels, exp, function (value) {
        // 如果条件为true，则启动继续编译，但只编译一次，编译过就不需要再编译了
        if (!terminated && value) {
            // 恢复后面的命令
            for (var _i = 0, caches_1 = caches; _i < caches_1.length; _i++) {
                var cache = caches_1[_i];
                cache.target.__bind_commands__ = cache.params;
                // 继续编译
                compile(mediator, cache.target, envModels);
            }
            // 设置已终结标识
            terminated = true;
        }
    });
}
/**
 * 编译bindFor命令，会中止编译，直到生成新的renderer实例时才会继续编译新实例
 */
export function compileFor(mediator, currentTarget, target, envModels, name, exp, mediatorCls, declaredMediatorCls, dataExp) {
    // 将后面的编译命令缓存起来
    var leftHandlers = target.__stop_left_handlers__;
    // 绑定for命令
    bindManager.bindFor(mediator, currentTarget, target, envModels, name, exp, mediatorCls, declaredMediatorCls, dataExp, function (data, renderer, subEnvModels) {
        var subLeftHandlers = leftHandlers.concat();
        var bindTargets = [];
        // 针对每一个renderer赋值后续编译指令
        for (var _i = 0, subLeftHandlers_1 = subLeftHandlers; _i < subLeftHandlers_1.length; _i++) {
            var leftHandler = subLeftHandlers_1[_i];
            leftHandler(renderer, bindTargets, subLeftHandlers);
        }
        // 编译renderer实例
        for (var depth in bindTargets) {
            var dict = bindTargets[depth];
            dict.forEach(function (currentTarget) { return compile(mediator, currentTarget, subEnvModels); });
        }
    });
}
/**
 * 编译bindMessage命令，不会中止编译
 */
export function compileMessage(mediator, currentTarget, target, envModels, type, name, exp, observable) {
    bindManager.bindMessage(mediator, currentTarget, target, envModels, type, name, exp, observable);
}
/**
 * 编译bindResponse命令，不会中止编译
 */
export function compileResponse(mediator, currentTarget, target, envModels, type, name, exp, observable) {
    bindManager.bindResponse(mediator, currentTarget, target, envModels, type, name, exp, observable);
}
/**
 * 搜索UI，取到目标节点，执行回调
 *
 * @export
 * @param {*} values 值结构字典
 * @param {*} ui ui实体
 * @param {(ui:any, key:string, value:any, depth?:number)=>void} callback 回调
 * @param {number} [depth=0] 遍历深度，方法会继续增加这个深度
 */
export function searchUI(values, ui, callback, depth) {
    if (depth === void 0) { depth = 0; }
    for (var key in values) {
        var value = values[key];
        var index = key.indexOf(".");
        if (index >= 0) {
            // 是表达式寻址，递归寻址
            var newValue = {};
            newValue[key.substr(index + 1)] = value;
            searchUI(newValue, ui[key.substring(0, index)], callback, depth + 1);
        }
        else if (typeof value == "object" && !(value instanceof Array)) {
            // 是子对象寻址，递归寻址
            searchUI(value, ui[key], callback, depth + 1);
        }
        else {
            // 是表达式，调用回调，将调用层级也传递回去
            callback(ui, key, value, depth);
        }
    }
}
