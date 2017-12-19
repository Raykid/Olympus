import { bindManager } from "../bind/BindManager";
function getBindParams(target) {
    var bindParams = target.__bind_commands__;
    if (!bindParams) {
        bindParams = [];
        Object.defineProperty(target, "__bind_commands__", {
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
 * @param {ICompileTarget} target 显示对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export function pushCompileCommand(target, cmd) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    // 添加编译指令
    getBindParams(target).push({ cmd: cmd, args: args });
}
/**
 * 添加编译命令到显示对象上（反向）
 *
 * @export
 * @param {ICompileTarget} target 显示对象
 * @param {IBindCommand} cmd 命令函数
 * @param {...any[]} args 命令参数列表
 */
export function unshiftCompileCommand(target, cmd) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    getBindParams(target).unshift({ cmd: cmd, args: args });
}
/**
 * 编译显示对象，会先编译自身，然后再递归编译子对象
 *
 * @export
 * @param {IMediator} mediator 显示对象所属的中介者
 * @param {ICompileTarget} target 显示对象
 */
export function compile(mediator, target) {
    // 取到编译参数列表
    var bindParams = target.__bind_commands__;
    // 编译target自身
    if (bindParams) {
        // 这里没有提前读取出length属性，因为需要动态判断数组长度
        for (var i = 0; i < bindParams.length;) {
            // 使用shift按顺序取出编译命令
            var params = bindParams.shift();
            // 调用编译命令，并且更新中止状态
            params.cmd.apply(params, [mediator, target].concat(params.args));
        }
    }
}
/**
 * 编译bindValue命令，不会中止编译
 */
export function compileValue(mediator, target, name, exp) {
    bindManager.bindValue(mediator, target, name, exp);
}
/**
 * 编译bindFunc命令，不会中止编译
 */
export function compileFunc(mediator, target, name) {
    var argExps = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        argExps[_i - 3] = arguments[_i];
    }
    bindManager.bindFunc.apply(bindManager, [mediator, target, name].concat(argExps));
}
/**
 * 编译bindOn命令，不会中止编译
 */
export function compileOn(mediator, target, type, exp) {
    bindManager.bindOn(mediator, target, type, exp);
}
/**
 * 编译bindIf命令，会中止编译，直到判断条件为true时才会启动以继续编译
 */
export function compileIf(mediator, target, exp) {
    // 将后面的编译命令缓存起来
    var bindParams = target.__bind_commands__;
    var cached = bindParams.splice(0, bindParams.length);
    // 绑定if命令
    var terminated = false;
    bindManager.bindIf(mediator, target, exp, function (value) {
        // 如果条件为true，则启动继续编译，但只编译一次，编译过就不需要再编译了
        if (!terminated && value) {
            // 恢复后面的命令
            target.__bind_commands__ = cached;
            // 继续编译
            compile(mediator, target);
            // 设置已终结标识
            terminated = true;
        }
    });
}
/**
 * 编译bindFor命令，会中止编译，直到生成新的renderer实例时才会继续编译新实例
 */
export function compileFor(mediator, target, exp) {
    // 将后面的编译命令缓存起来
    var leftHandlers = target.__stop_left_handlers__;
    // 绑定if命令
    bindManager.bindFor(mediator, target, exp, function (data, renderer) {
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
            dict.forEach(function (target) { return compile(mediator, target); });
        }
    });
}
/**
 * 编译bindMessage命令，不会中止编译
 */
export function compileMessage(mediator, target, type, name, exp, observable) {
    bindManager.bindMessage(mediator, target, type, name, exp, observable);
}
/**
 * 编译bindResponse命令，不会中止编译
 */
export function compileResponse(mediator, target, type, name, exp, observable) {
    bindManager.bindResponse(mediator, target, type, name, exp, observable);
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
