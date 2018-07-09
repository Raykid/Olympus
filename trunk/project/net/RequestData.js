var RequestData = /** @class */ (function () {
    function RequestData() {
        /**
         * 用户参数，可以保存任意参数到Message中，该参数中的数据不会被发送
         *
         * @type {*}
         * @memberof RequestData
         */
        this.__userData = {};
        /**
         * 是否在接到返回前使用loading类型遮罩覆盖全屏，防止用户操作，默认是true
         *
         * @type {boolean}
         * @memberof RequestData
         */
        this.__useMask = true;
        /**
         * 消息派发内核列表
         *
         * @type {IObservable}
         * @memberof RequestData
         */
        this.__observables = [];
        // 禁掉部分本地变量的可遍历性
        Object.defineProperties(this, {
            __userData: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: this.__userData
            },
            __observables: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: this.__observables
            }
        });
    }
    Object.defineProperty(RequestData.prototype, "__observable", {
        /**
         * 消息当前所属内核
         *
         * @type {IObservable}
         * @memberof RequestData
         */
        get: function () {
            return this.__observables[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "__oriObservable", {
        /**
         * 消息所属的原始内核（第一个派发到的内核）
         *
         * @type {IObservable}
         * @memberof RequestData
         */
        get: function () {
            return this.__observables[this.__observables.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestData.prototype, "__type", {
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
    /**
     * 再次发送消息，会使用首个内核重新发送该消息
     *
     * @memberof RequestData
     */
    RequestData.prototype.redispatch = function () {
        this.__oriObservable.dispatch(this);
    };
    return RequestData;
}());
export default RequestData;
/** 导出公共消息参数对象 */
export var commonData = {};
