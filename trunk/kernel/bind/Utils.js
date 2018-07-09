import Dictionary from '../../utils/Dictionary';
import { replaceDisplay } from '../../utils/DisplayUtil';
import { extendObject, getObjectHashs } from "../../utils/ObjectUtil";
import Bind from './Bind';
function wrapEvalFunc(exp) {
    // 这个方法的功能主要是将多个scope合并成为一个scope
    return function () {
        var scopes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scopes[_i] = arguments[_i];
        }
        var scope = extendObject.apply(void 0, [{}].concat(scopes.reverse()));
        return exp.call(this, scope);
    };
}
/**
 * 将表达式包装成为方法
 *
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} scopeCount 参数个数，仅在exp为表达式时有效
 * @returns {EvalFunc} 包装方法
 */
function wrapEvalFuncExp(exp, scopeCount) {
    if (typeof exp === "string") {
        var argList = [];
        var expStr = exp;
        for (var i = 0; i < scopeCount; i++) {
            argList.push("s" + i);
            expStr = "with(s" + i + "||{}){" + expStr + "}";
        }
        return Function(argList.join(","), expStr);
    }
    else {
        return wrapEvalFunc(exp);
    }
}
/**
 * 创建一个执行方法，用于未来执行
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export function createRunFunc(exp, scopeCount) {
    if (scopeCount === void 0) { scopeCount = 0; }
    if (typeof exp === "string") {
        var func;
        try {
            func = wrapEvalFuncExp(exp, scopeCount);
        }
        catch (err) {
            // 可能是某些版本的解释器不认识模板字符串，将模板字符串变成普通字符串
            var sepStr = (exp.indexOf('"') < 0 ? '"' : "'");
            // 将exp中的·替换为'
            var reg = /([^\\]?)`/g;
            exp = exp.replace(reg, "$1" + sepStr);
            // 将exp中${...}替换为" + ... + "的形式
            reg = /\$\{(.*?)\}/g;
            exp = exp.replace(reg, sepStr + "+($1)+" + sepStr);
            // 重新生成方法并返回
            func = wrapEvalFuncExp(exp, scopeCount);
        }
        return func;
    }
    else {
        return wrapEvalFunc(exp);
    }
}
/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 */
export function runExp(exp, thisArg) {
    var scopes = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        scopes[_i - 2] = arguments[_i];
    }
    createRunFunc(exp, scopes.length).apply(thisArg, scopes);
}
/**
 * 创建一个表达式求值方法，用于未来执行
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export function createEvalFunc(exp, scopeCount) {
    if (scopeCount === void 0) { scopeCount = 0; }
    if (typeof exp === "string")
        return createRunFunc("return " + exp, scopeCount);
    else
        return wrapEvalFunc(exp);
}
/**
 * 表达式求值，无法执行多条语句
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 * @returns {*} 返回值
 */
export function evalExp(exp, thisArg) {
    var scopes = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        scopes[_i - 2] = arguments[_i];
    }
    return createEvalFunc(exp, scopes.length).apply(thisArg, scopes);
}
export var bindDict = new Dictionary();
/**
 * 绑定数据到UI上
 *
 * @param {IComponent} comp 组件
 * @returns {Bind} 返回绑定实例
 * @memberof BindManager
 */
export function bind(comp) {
    var bindData = bindDict.get(comp);
    if (!bindData) {
        bindDict.set(comp, bindData = {
            bind: new Bind(comp),
            callbacks: []
        });
    }
    // 重新绑定所有
    for (var _i = 0, _a = bindData.callbacks; _i < _a.length; _i++) {
        var callback = _a[_i];
        callback();
    }
    // 返回Bind对象
    return bindData.bind;
}
/**
 * 移除绑定
 *
 * @param {IComponent} comp
 * @returns {Bind}
 * @memberof BindManager
 */
export function unbind(comp) {
    var bindData = bindDict.get(comp);
    if (bindData) {
        bindData.bind.dispose();
        bindDict.delete(comp);
    }
    return bindData && bindData.bind;
}
function addBindHandler(comp, callback) {
    var handler = function () {
        // 判断数据是否合法
        if (!comp.viewModel)
            return;
        // 开始绑定
        callback();
    };
    // 添加绑定数据
    var bindData = bindDict.get(comp);
    if (bindData.callbacks.indexOf(handler) < 0)
        bindData.callbacks.push(handler);
    // 立即调用一次
    handler();
}
function getNearestAncestor(bridge, target, propName) {
    if (!target || target[propName])
        return target;
    else
        return getNearestAncestor(bridge, bridge.getParent(target), propName);
}
/**
 * 绑定属性值
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定的属性名
 * @param {(EvalExp)} exp 绑定的表达式或方法
 * @memberof BindManager
 */
export function bindValue(comp, currentTarget, target, envModels, name, exp) {
    var watcher;
    var bindData = bindDict.get(comp);
    addBindHandler(comp, function () {
        // 如果之前绑定过，则要先销毁之
        if (watcher)
            watcher.dispose();
        // 绑定新的订阅者
        watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, exp, function (value) {
                currentTarget[name] = value;
            }, comp.viewModel].concat(envModels, [comp.viewModel]));
        var _a;
    });
}
/**
 * 绑定一个表达式，与bindValue类似，但不会给属性赋值
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {(EvalExp)} exp 绑定的表达式或方法
 * @memberof BindManager
 */
export function bindExp(comp, currentTarget, target, envModels, exp) {
    var watcher;
    var bindData = bindDict.get(comp);
    addBindHandler(comp, function () {
        // 如果之前绑定过，则要先销毁之
        if (watcher)
            watcher.dispose();
        // 绑定新的订阅者
        watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, exp, function (value) {
                // 不干任何事情
            }, comp.viewModel].concat(envModels, [comp.viewModel]));
        var _a;
    });
}
/**
 * 绑定方法执行
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定的方法名
 * @param {...(EvalExp)[]} argExps 执行方法的参数表达式或方法列表
 * @memberof BindManager
 */
export function bindFunc(comp, currentTarget, target, envModels, name) {
    var _this = this;
    var argExps = [];
    for (var _i = 5; _i < arguments.length; _i++) {
        argExps[_i - 5] = arguments[_i];
    }
    var watchers = [];
    var bindData = bindDict.get(comp);
    addBindHandler(comp, function () {
        // 判断参数数量，无参数方法一次性执行即可，无需绑定，有参数的方法则需要每次参数改变就执行一次
        if (argExps.length > 0) {
            // 将表达式中所有undefined和null变为内部值
            var undefinedValue = Date.now() * Math.random() + "_undefined";
            var nullValue = Date.now() * Math.random() + "_null";
            argExps = argExps.map(function (exp) {
                if (exp === undefined)
                    return "'" + undefinedValue + "'";
                else if (exp === null)
                    return "'" + nullValue + "'";
                else
                    return exp;
            });
            // 绑定表达式参数数组
            var initValue = {};
            var args = [];
            var argsInited = false;
            var handler = function (index, value) {
                // 将value中的undefined和null恢复回去
                if (value === undefinedValue)
                    value = undefined;
                else if (value == nullValue)
                    value = null;
                // 设置参数值
                args[index] = value;
                // 判断参数是否齐全
                if (!argsInited) {
                    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                        var arg = args_1[_i];
                        // 如果列表里存在初始值，表示没有赋值完毕，直接返回
                        if (arg === initValue)
                            return;
                    }
                    // 设置初始化完毕状态
                    argsInited = true;
                }
                // 赋值已经完毕了，调用方法，this指向ui本身
                currentTarget[name].apply(currentTarget, args);
            };
            // 清理旧的订阅者
            for (var i = 0, len = watchers.length; i < len; i++) {
                watchers.shift().dispose();
            }
            // 循环绑定表达式到handler
            for (var i = 0, len = argExps.length; i < len; i++) {
                // 记录一个初始值，用于判断参数列表是否已赋值完毕
                args.push(initValue);
            }
            for (var i = 0, len = argExps.length; i < len; i++) {
                // 绑定表达式
                var watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, argExps[i], handler.bind(_this, i), comp.viewModel].concat(envModels, [comp.viewModel]));
                // 记录订阅者
                watchers.push(watcher);
            }
        }
        else {
            // 无参数执行，无需绑定，一次性执行即可
            target[name]();
        }
        var _a;
    });
}
/**
 * 绑定事件
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} type 绑定的事件类型
 * @param {EvalExp} exp 绑定的事件回调表达式或方法
 * @memberof BindManager
 */
export function bindOn(comp, currentTarget, target, envModels, type, exp) {
    addBindHandler(comp, function () {
        var commonScope = {
            $this: comp,
            $data: comp.viewModel,
            $bridge: comp.bridge,
            $currentTarget: currentTarget,
            $target: target
        };
        // 计算事件hash
        var onHash = getObjectHashs(currentTarget, type, exp);
        // 如果之前添加过监听，则先移除之
        var handler = currentTarget[onHash];
        if (handler) {
            comp.bridge.unmapListener(currentTarget, type, handler, comp.viewModel);
            handler = null;
        }
        // 先尝试用exp当做方法名去viewModel里寻找，如果找不到则把exp当做一个执行表达式处理，外面包一层方法
        if (typeof exp === "string")
            handler = comp.viewModel[exp];
        if (!(handler instanceof Function)) {
            var func = createRunFunc(exp, 3 + envModels.length);
            // 这里要转一手，记到闭包里一个副本，否则因为bindOn是延迟操作，到时envModel可能已被修改
            handler = function (event) {
                func.call.apply(func, [this, commonScope].concat(envModels, [comp.viewModel, { $event: event }]));
            };
        }
        comp.bridge.mapListener(currentTarget, type, handler, comp.viewModel);
        // 将事件回调记录到显示对象上
        currentTarget[onHash] = handler;
        // 如果__bind_sub_events__列表存在，则将事件记录到其上
        var nearestAncestor = getNearestAncestor(comp.bridge, target, "__bind_sub_events__");
        var events = (nearestAncestor || target).__bind_sub_events__;
        if (events) {
            events.push({
                target: currentTarget,
                type: type,
                handler: handler,
                thisArg: comp.viewModel
            });
        }
    });
}
/**
 * 绑定显示
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {EvalExp} exp 绑定表达式或方法
 * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
 * @memberof BindManager
 */
export function bindIf(comp, currentTarget, target, envModels, exp, callback) {
    var watcher;
    var bindData = bindDict.get(comp);
    var replacer = comp.bridge.createEmptyDisplay();
    addBindHandler(comp, function () {
        // 如果之前绑定过，则要先销毁之
        if (watcher)
            watcher.dispose();
        // 绑定表达式
        watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, exp, function (value) {
                // 如果表达式为true则显示ui，否则移除ui
                if (value)
                    replaceDisplay(comp.bridge, replacer, currentTarget);
                else
                    replaceDisplay(comp.bridge, currentTarget, replacer);
                // 触发回调
                callback && callback(value);
            }, comp.viewModel].concat(envModels, [comp.viewModel]));
        var _a;
    });
}
var _regExp = /^\s*(\w+)\s+((in)|(of))\s+(.+?)\s*$/;
/**
 * 绑定循环
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定本来所在的对象在Component中的名字
 * @param {string} exp 循环表达式，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）。b可以是个表达式
 * @param {IComponentConstructor} [compCls] 提供该参数将使用提供的组件包装每一个渲染器
 * @param {IComponentConstructor} [declaredComponentCls] 声明的Component类型
 * @param {string} [dataExp] 提供给组件包装器的数据表达式
 * @param {(data:any, renderer:any, envModels:any[])=>void} [callback] 每次生成新的renderer实例时调用这个回调
 * @memberof BindManager
 */
export function bindFor(comp, currentTarget, target, envModels, name, exp, compCls, declaredComponentCls, dataExp, callback) {
    var watcher;
    var bindData = bindDict.get(comp);
    var subComponentCache = [];
    addBindHandler(comp, function () {
        // 解析表达式
        var res = _regExp.exec(exp);
        if (!res)
            return;
        // 如果给出了声明的Component类型，则生成一个声明Component，替换掉comp当前的皮肤
        var declaredComponent;
        if (declaredComponentCls) {
            declaredComponent = new declaredComponentCls(target);
            comp.delegate(declaredComponent);
            comp[name] = declaredComponent;
        }
        // 包装渲染器创建回调
        var memento = comp.bridge.wrapBindFor(currentTarget, function (key, value, renderer) {
            // 设置环境变量
            var commonScope = {
                $key: key,
                $value: value,
                $parent: envModels[0] || comp.viewModel
            };
            // 填入用户声明的属性
            commonScope[res[1]] = (res[2] == "in" ? key : value);
            // 生成一个环境变量的副本
            var subEnvModels = envModels.concat();
            // 插入环境变量
            subEnvModels.unshift(commonScope);
            // 如果renderer已经有事件列表了，说明renderer是被重用的，删除所有事件
            var events = renderer.__bind_sub_events__;
            for (var i in events) {
                var data = events.pop();
                comp.bridge.unmapListener(data.target, data.type, data.handler, data.thisArg);
            }
            // 为renderer设置子对象事件列表
            if (!events)
                renderer.__bind_sub_events__ = [];
            // 为renderer套一个Component外壳
            if (compCls) {
                var subComponent = new compCls(renderer);
                // 更新渲染器
                if (subComponent.skin && subComponent.bridge === comp.bridge)
                    renderer = subComponent.skin;
                // 托管子组件，优先托管在声明出来的中间组件上
                (declaredComponent || comp).delegate(subComponent);
                // 开启该组件，优先使用dataExp，如果没有则使用当前所有的数据
                var data_1;
                if (dataExp) {
                    // 有数据表达式，求出数据表达式的值来
                    data_1 = evalExp.apply(void 0, [dataExp, comp.viewModel].concat(subEnvModels.concat().reverse(), [comp.viewModel]));
                }
                else {
                    // 没有数据表达式，套用当前所在变量域，且要打平做成一个data
                    data_1 = extendObject.apply(void 0, [{}, comp.viewModel].concat(subEnvModels));
                }
                subComponent.open(data_1);
                // 缓存子组件
                subComponentCache.push(subComponent);
            }
            // 触发回调，进行内部编译
            callback && callback(value, renderer, subEnvModels);
        });
        // 如果之前绑定过，则要先销毁之
        if (watcher)
            watcher.dispose();
        // 获得要遍历的数据集合
        watcher = (_a = bindData.bind).createWatcher.apply(_a, [currentTarget, target, res[5], function (datas) {
                // 如果遍历的对象是个数字，则伪造一个临时数组供使用
                if (typeof datas === "number") {
                    var tempArr = [];
                    for (var i = 0; i < datas; i++) {
                        tempArr.push(i);
                    }
                    datas = tempArr;
                }
                // 清空已有的子组件
                for (var i = 0, len = subComponentCache.length; i < len; i++) {
                    var subComponent = subComponentCache.shift();
                    comp.undelegate(subComponent);
                    subComponent.dispose();
                }
                // 赋值
                comp.bridge.valuateBindFor(currentTarget, datas, memento);
            }, comp.viewModel].concat(envModels, [comp.viewModel]));
        var _a;
    });
}
