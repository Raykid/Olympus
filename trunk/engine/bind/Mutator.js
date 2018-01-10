import { getObjectHashs } from "../../utils/ObjectUtil";
import Dep from "./Dep";
import Watcher from "./Watcher";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 变异器，将ViewModel变异为具有依赖功能的形式，也可以认为是编译过程
*/
// 记录数组中会造成数据更新的所有方法名
var _arrMethods = [
    "push",
    "pop",
    "unshift",
    "shift",
    "splice",
    "sort",
    "reverse"
];
/**
 * 将用户传进来的数据“变异”成为具有截获数据变更能力的数据
 * @param data 原始数据
 * @returns {any} 变异后的数据
 */
export function mutate(data) {
    // 如果是简单类型，则啥也不做
    if (!data || typeof data != "object")
        return data;
    // 递归变异所有内部变量，及其__proto__下的属性，因为getter/setter会被定义在__proto__上，而不是当前对象上
    var keys = Object.keys(data).concat(Object.keys(data.__proto__));
    // 去重
    var temp = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!temp[key]) {
            temp[key] = key;
            mutateObject(data, key);
        }
    }
    return data;
}
function mutateObject(data, key) {
    var depKey = getObjectHashs(data, key);
    // 对每个复杂类型对象都要有一个对应的依赖列表
    var dep = data[depKey];
    if (!dep) {
        dep = new Dep();
        // 判断本来这个属性是值属性还是getter/setter属性，要有不同的操作方式
        var desc = Object.getOwnPropertyDescriptor(data, key) || Object.getOwnPropertyDescriptor(data.__proto__, key);
        if (desc) {
            // 如果是数组，则要进行过一下数组变异
            if (data[key] instanceof Array) {
                mutateArray(data[key], dep);
            }
            // 开始变异当前属性
            if (desc.hasOwnProperty("value")) {
                // 值属性的变异过程
                Object.defineProperty(data, key, {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        // 如果Watcher.updating不是null，说明当前正在执行表达式，那么获取的变量自然是其需要依赖的
                        var watcher = Watcher.updating;
                        if (watcher)
                            dep.watch(watcher);
                        // 利用闭包保存原始值
                        return desc.value;
                    },
                    set: function (v) {
                        if (!desc.writable || v === desc.value)
                            return;
                        desc.value = v;
                        // 如果是数组就走专门的数组变异方法，否则递归变异对象
                        if (Array.isArray(v))
                            mutateArray(v, dep);
                        else
                            mutate(v);
                        // 触发通知
                        dep.notify();
                    }
                });
            }
            else {
                // getter/setter属性的变异过程
                Object.defineProperty(data, key, {
                    enumerable: true,
                    configurable: false,
                    get: function () {
                        if (!desc.get)
                            return;
                        // 如果Watcher.updating不是null，说明当前正在执行表达式，那么获取的变量自然是其需要依赖的
                        var watcher = Watcher.updating;
                        if (watcher)
                            dep.watch(watcher);
                        // 返回get方法结果
                        return desc.get.call(data);
                    },
                    set: function (v) {
                        if (!desc.set)
                            return;
                        // 设置
                        desc.set.call(data, v);
                        // 如果是数组就走专门的数组变异方法，否则递归变异对象
                        if (Array.isArray(v))
                            mutateArray(v, dep);
                        else
                            mutate(v);
                        // 触发通知
                        dep.notify();
                    }
                });
            }
        }
        // 打一个标记表示已经变异过了
        Object.defineProperty(data, depKey, {
            value: dep,
            writable: false,
            enumerable: false,
            configurable: false
        });
    }
    // 递归子属性
    mutate(data[key]);
}
function mutateArray(arr, dep) {
    // 变异当前数组
    arr["__proto__"] = defineReactiveArray(dep);
    // 遍历当前数组，将内容对象全部变异
    for (var i = 0, len = arr.length; i < len; i++) {
        mutate(arr[i]);
    }
}
function defineReactiveArray(dep) {
    var proto = Array.prototype;
    var result = Object.create(proto);
    // 遍历所有方法，一个一个地变异
    _arrMethods.forEach(function (method) {
        // 利用闭包记录一个原始方法
        var oriMethod = proto[method];
        // 开始变异
        Object.defineProperty(result, method, {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                // 首先调用原始方法，获取返回值
                var result = oriMethod.apply(this, args);
                // 数组插入项
                var inserted;
                switch (method) {
                    case "push":
                    case "unshift":
                        inserted = args;
                        break;
                    case "splice":
                        inserted = args.slice(2);
                        break;
                }
                // 监视数组插入项，而不是重新监视整个数组
                if (inserted && inserted.length) {
                    mutateArray(inserted, dep);
                }
                // 触发更新
                dep.notify({ method: args });
                // 返回值
                return result;
            }
        });
    });
    // 提供替换数组设置的方法，因为直接设置数组下标的方式无法变异
    Object.defineProperty(result, "$set", {
        value: function (index, value) {
            // 超出数组长度默认追加到最后
            if (index >= this.length)
                index = this.length;
            return this.splice(index, 1, value)[0];
        }
    });
    // 提供替换数组移除的方法，因为直接移除的方式无法变异
    Object.defineProperty(result, "$remove", {
        value: function (item) {
            var index = this.indexOf(item);
            if (index > -1)
                return this.splice(index, 1);
            return null;
        }
    });
    return result;
}
