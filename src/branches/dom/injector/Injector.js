define(["require", "exports", "../../../trunk/utils/ConstructUtil", "../../../trunk/engine/injector/Injector", "../../../trunk/engine/bridge/BridgeManager", "../../DOMBridge", "../utils/SkinUtil"], function (require, exports, ConstructUtil_1, Injector_1, BridgeManager_1, DOMBridge_1, SkinUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function DOMMediatorClass() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args[0] instanceof Function) {
            // 调用MediatorClass方法
            var cls = Injector_1.MediatorClass(args[0]);
            // 监听类型实例化，赋值表现层桥
            ConstructUtil_1.listenConstruct(cls, function (mediator) { return mediator.bridge = BridgeManager_1.bridgeManager.getBridge(DOMBridge_1.default.TYPE); });
            // 返回结果类型
            return cls;
        }
        else {
            return function (cls) {
                // 调用MediatorClass方法
                cls = Injector_1.MediatorClass(cls);
                // 监听类型实例化，转换皮肤格式
                ConstructUtil_1.listenConstruct(cls, function (mediator) { return SkinUtil_1.wrapSkin(mediator, args); });
                // 返回结果类型
                return cls;
            };
        }
    }
    exports.DOMMediatorClass = DOMMediatorClass;
});
//# sourceMappingURL=Injector.js.map