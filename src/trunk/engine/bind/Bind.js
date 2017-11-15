define(["require", "exports", "./Watcher", "../../utils/ObjectUtil"], function (require, exports, Watcher_1, ObjectUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
         * @param {*} target 作用目标，指表达式所在的显示对象
         * @param {string} exp 表达式
         * @param {*} scope 作用域
         * @param {WatcherCallback} callback 订阅器回调
         * @returns {IWatcher} 返回观察者本身
         * @memberof Bind
         */
        Bind.prototype.createWatcher = function (target, exp, scope, callback) {
            var key = ObjectUtil_1.getObjectHashs(target, exp, scope);
            var watcher = this._watcherDict[key];
            if (!watcher)
                this._watcherDict[key] = watcher = new Watcher_1.default(this, target, exp, scope, callback);
            return watcher;
        };
        return Bind;
    }());
    exports.default = Bind;
});
//# sourceMappingURL=Bind.js.map