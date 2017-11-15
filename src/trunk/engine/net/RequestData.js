define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RequestData = /** @class */ (function () {
        function RequestData() {
            /**
             * 用户参数，可以保存任意参数到Message中，该参数中的数据不会被发送
             *
             * @type {*}
             * @memberof RequestData
             */
            this.__userData = {};
        }
        Object.defineProperty(RequestData.prototype, "type", {
            /**
             * 获取请求消息类型字符串
             *
             * @readonly
             * @type {string}
             * @memberof RequestData
             */
            get: function () {
                return this.__params.type;
            },
            enumerable: true,
            configurable: true
        });
        return RequestData;
    }());
    exports.default = RequestData;
    /** 导出公共消息参数对象 */
    exports.commonData = {};
});
//# sourceMappingURL=RequestData.js.map