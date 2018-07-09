import { evalExp } from '../../kernel/bind/Utils';
import { core } from '../core/Core';
import { netManager } from "../net/NetManager";
/**
 * 绑定Message
 *
 * @export
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {IConstructor|string} type 绑定的消息类型字符串
 * @param {string} name 绑定的属性名
 * @param {EvalExp} exp 绑定的表达式或方法
 * @param {IObservable} [observable] 绑定的消息内核，默认是core
 */
export function bindMessage(comp, currentTarget, target, envModels, type, name, exp, observable) {
    if (!observable)
        observable = core.observable;
    var handler = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (comp.disposed) {
            // comp已销毁，取消监听
            observable.unlisten(type, handler);
        }
        else {
            var msg;
            if (args.length == 1 && typeof args[0] == "object" && args[0].type)
                msg = args[0];
            else
                msg = { $arguments: args };
            // 设置通用属性
            var commonScope = {
                $this: comp,
                $data: comp.viewModel,
                $bridge: comp.bridge,
                $currentTarget: currentTarget,
                $target: target
            };
            currentTarget[name] = evalExp.apply(void 0, [exp, comp.viewModel, msg].concat(envModels, [comp.viewModel, commonScope]));
        }
    };
    // 添加监听
    observable.listen(type, handler);
}
/**
 * 绑定Response
 *
 * @export
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {IResponseDataConstructor|string} type 绑定的通讯消息类型
 * @param {string} name 绑定的属性名
 * @param {EvalExp} exp 绑定的表达式或方法
 * @param {IObservable} [observable] 绑定的消息内核，默认是core
 */
export function bindResponse(comp, currentTarget, target, envModels, type, name, exp, observable) {
    if (!observable)
        observable = core.observable;
    var handler = function (response) {
        if (comp.disposed) {
            // comp已销毁，取消监听
            netManager.unlistenResponse(type, handler, null, null, observable);
        }
        else {
            // 设置通用属性
            var commonScope = {
                $this: comp,
                $data: comp.viewModel,
                $bridge: comp.bridge,
                $currentTarget: currentTarget,
                $target: target
            };
            currentTarget[name] = evalExp.apply(void 0, [exp, comp.viewModel, response].concat(envModels, [comp.viewModel, commonScope]));
        }
    };
    // 添加监听
    netManager.listenResponse(type, handler, null, null, observable);
    // 如果comp所依赖的模块有初始化消息，则要额外触发初始化消息的绑定
    if (comp["dependModuleInstance"]) {
        for (var _i = 0, _a = comp["dependModuleInstance"].responses; _i < _a.length; _i++) {
            var response = _a[_i];
            handler(response);
        }
    }
}
