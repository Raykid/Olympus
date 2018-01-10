import Watcher from "./Watcher";
import { getObjectHashs } from "../../utils/ObjectUtil";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 一个绑定
*/
var Bind = /** @class */ (function () {
    function Bind(mediator) {
        this._watcherDict = {};
        this._mediator = mediator;
    }
    Object.defineProperty(Bind.prototype, "mediator", {
        /**
         * 获取已绑定的中介者实例
         *
         * @readonly
         * @type {IMediator}
         * @memberof Bind
         */
        get: function () {
            return this._mediator;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 创建一个观察者，在数值变更时会通知回调进行更新
     *
     * @param {*} currentTarget 作用目标，指表达式所在的显示对象
     * @param {*} target 绑定表达式本来所在的对象
     * @param {string} exp 表达式
     * @param {WatcherCallback} callback 订阅器回调
     * @param {...any[]} scopes 作用域列表，首个作用域会被当做this指向
     * @returns {IWatcher} 返回观察者本身
     * @memberof Bind
     */
    Bind.prototype.createWatcher = function (currentTarget, target, exp, callback) {
        var scopes = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            scopes[_i - 4] = arguments[_i];
        }
        var key = getObjectHashs.apply(void 0, [currentTarget, exp].concat(scopes));
        var watcher = this._watcherDict[key];
        if (!watcher)
            this._watcherDict[key] = watcher = new (Watcher.bind.apply(Watcher, [void 0, this, currentTarget, target, exp, callback].concat(scopes)))();
        return watcher;
    };
    return Bind;
}());
export default Bind;
