import { bindManager } from 'olympus-r/engine/bind/BindManager';
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import { listenOnOpen, pushCompileCommand, searchUIDepth } from 'olympus-r/engine/injector/BindUtil';
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import { listenApply, listenConstruct } from "olympus-r/utils/ConstructUtil";
import DOMBridge from "../../DOMBridge";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 *
 * 负责注入的模块
*/
export function DOMMediatorClass(moduleName, skin) {
    var skins = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        skins[_i - 2] = arguments[_i];
    }
    return function (cls) {
        // 调用MediatorClass方法
        cls = MediatorClass(moduleName)(cls);
        // 监听类型实例化，转换皮肤格式
        var finalSkin;
        if (skins.length === 0) {
            finalSkin = skin;
        }
        else {
            skins.unshift(skin);
            finalSkin = skins;
        }
        listenConstruct(cls, function (mediator) {
            // 先赋值桥
            mediator.bridge = bridgeManager.getBridge(DOMBridge.TYPE);
            // 然后监听onOpen，在onOpen中设置皮肤
            listenApply(mediator, "onOpen", function (mediator) {
                mediator.skin = finalSkin;
            });
        });
        // 返回结果类型
        return cls;
    };
}
/**
 * 编译css命令
 */
function compileCSS(mediator, currentTarget, target, envModels, dict) {
    var watcher;
    var bindData = bindManager.getBindData(mediator);
    bindManager.addBindHandler(mediator, function () {
        // 如果之前绑定过，则要先销毁之
        if (watcher)
            watcher.dispose();
        // 取出当前已有的className
        var curClassName = currentTarget["className"];
        // 生成表达式数组
        var names = [];
        var exps = [];
        for (var name in dict) {
            names.push(name);
            exps.push(dict[name]);
        }
        // 绑定新的订阅者，表达式为字典中的所有表达式组成的数组
        var exp = "[" + exps.join(",") + "]";
        watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, exp, function (judges) {
                var resultNames = names.filter(function (name, index) { return judges[index]; });
                if (curClassName !== "")
                    resultNames.unshift(curClassName);
                // 为目标的className属性赋值
                currentTarget["className"] = resultNames.join(" ");
            }, mediator.viewModel].concat(envModels, [mediator.viewModel]));
        var _a;
    });
}
/**
 * @private
 */
export function BindCSS(arg1, arg2) {
    return function (prototype, propertyKey) {
        listenOnOpen(prototype, function (mediator) {
            var target = mediator[propertyKey];
            if (typeof arg1 === "string") {
                // 指定了寻址路径，需要寻址
                var uiDict = {};
                uiDict[arg1] = 13;
                // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                searchUIDepth(uiDict, mediator, target, function (currentTarget, target) {
                    // 添加编译指令
                    pushCompileCommand(currentTarget, target, compileCSS, arg2);
                }, true);
            }
            else {
                var hasPath = void 0;
                for (var key in arg1) {
                    hasPath = (typeof arg1[key] === "object");
                    break;
                }
                if (hasPath) {
                    // 生成寻址字典
                    var uiDict = {};
                    for (var name in arg1) {
                        uiDict[name] = 13;
                    }
                    // 遍历绑定的目标，将编译指令绑定到目标身上，而不是指令所在的显示对象身上
                    searchUIDepth(uiDict, mediator, target, function (currentTarget, target, name) {
                        // 添加编译指令
                        pushCompileCommand(currentTarget, target, compileCSS, arg1[name]);
                    }, true);
                }
                else {
                    // 没有指定寻址路径，就是要操作当前对象，但也要经过一次searchUIDepth操作
                    searchUIDepth({ r: 13 }, mediator, target, function (currentTarget, target) {
                        // 添加编译指令
                        pushCompileCommand(currentTarget, target, compileCSS, arg1);
                    });
                }
            }
        });
    };
}
