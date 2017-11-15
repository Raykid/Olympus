define(["require", "exports", "../../core/Core"], function (require, exports, Core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-14
     * @modify date 2017-09-14
     *
     * Model的基类，也可以不继承该基类，因为Model是很随意的东西
    */
    var Model = /** @class */ (function () {
        function Model() {
        }
        Model.prototype.dispatch = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            Core_1.core.dispatch.apply(Core_1.core, params);
        };
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Model
         */
        Model.prototype.listen = function (type, handler, thisArg) {
            Core_1.core.listen(type, handler, thisArg);
        };
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {Function} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Model
         */
        Model.prototype.unlisten = function (type, handler, thisArg) {
            Core_1.core.unlisten(type, handler, thisArg);
        };
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Model
         */
        Model.prototype.mapCommand = function (type, cmd) {
            Core_1.core.mapCommand(type, cmd);
        };
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Model
         */
        Model.prototype.unmapCommand = function (type, cmd) {
            Core_1.core.unmapCommand(type, cmd);
        };
        return Model;
    }());
    exports.default = Model;
});
//# sourceMappingURL=Model.js.map