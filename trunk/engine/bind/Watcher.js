import { createEvalFunc } from "./Utils";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 数据更新订阅者，当依赖的数据有更新时会触发callback通知外面
*/
var Watcher = /** @class */ (function () {
    function Watcher(bind, currentTarget, target, exp, callback, thisArg) {
        var scopes = [];
        for (var _i = 6; _i < arguments.length; _i++) {
            scopes[_i - 6] = arguments[_i];
        }
        this._disposed = false;
        // 记录Bind实例
        this._bind = bind;
        // 记录作用目标、表达式和作用域
        this._currentTarget = currentTarget;
        this._target = target;
        this._exp = exp;
        this._thisArg = thisArg;
        this._scopes = scopes;
        // 将表达式和作用域解析为一个Function
        this._expFunc = createEvalFunc(exp, 1 + scopes.length);
        // 记录回调函数
        this._callback = callback;
        // 进行首次更新
        this.update();
    }
    Object.defineProperty(Watcher.prototype, "disposed", {
        /**
         * 获取该观察者是否已经被销毁
         *
         * @readonly
         * @type {boolean}
         * @memberof Watcher
         */
        get: function () {
            return this._disposed;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取到表达式当前最新值
     * @returns {any} 最新值
     */
    Watcher.prototype.getValue = function () {
        if (this._disposed)
            return null;
        var value;
        // 记录自身
        Watcher.updating = this;
        // 设置通用属性
        var commonScope = {
            $this: this._bind.mediator,
            $data: this._bind.mediator.viewModel,
            $bridge: this._bind.mediator.bridge,
            $currentTarget: this._currentTarget,
            $target: this._target
        };
        // 表达式求值
        try {
            value = (_a = this._expFunc).call.apply(_a, [this._thisArg].concat(this._scopes, [commonScope]));
        }
        catch (err) {
            // 输出错误日志
            console.warn("表达式求值错误\nerr: " + err.toString() + "\nexp：" + this._exp);
        }
        // 移除自身记录
        Watcher.updating = null;
        return value;
        var _a;
    };
    /**
     * 当依赖的数据有更新时调用该方法
     * @param extra 可能的额外数据
     */
    Watcher.prototype.update = function (extra) {
        if (this._disposed)
            return;
        var value = this.getValue();
        if (!Watcher.isEqual(value, this._value)) {
            this._callback && this._callback(value, this._value, extra);
            this._value = Watcher.deepCopy(value);
        }
    };
    /** 销毁订阅者 */
    Watcher.prototype.dispose = function () {
        if (this._disposed)
            return;
        this._value = null;
        this._target = null;
        this._exp = null;
        this._scopes = null;
        this._expFunc = null;
        this._callback = null;
        this._disposed = true;
    };
    /**
     * 是否相等，包括基础类型和对象/数组的对比
     */
    Watcher.isEqual = function (a, b) {
        return (a == b || (Watcher.isObject(a) && Watcher.isObject(b)
            ? JSON.stringify(a) == JSON.stringify(b)
            : false));
    };
    /**
     * 是否为对象(包括数组、正则等)
     */
    Watcher.isObject = function (obj) {
        return (obj && typeof obj == "object");
    };
    /**
     * 复制对象，若为对象则深度复制
     */
    Watcher.deepCopy = function (from) {
        if (Watcher.isObject(from)) {
            try {
                // 复杂类型对象，先字符串化，再对象化
                return JSON.parse(JSON.stringify(from));
            }
            catch (err) { }
        }
        // 基本类型对象和无法复制的对象，直接返回之
        return from;
    };
    /** 记录当前正在执行update方法的Watcher引用 */
    Watcher.updating = null;
    Watcher._uid = 0;
    return Watcher;
}());
export default Watcher;
