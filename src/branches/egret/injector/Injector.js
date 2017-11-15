define(["require", "exports", "../../../trunk/utils/ConstructUtil", "../../../trunk/engine/injector/Injector", "../../../trunk/engine/bridge/BridgeManager", "../utils/SkinUtil", "../../EgretBridge"], function (require, exports, ConstructUtil_1, Injector_1, BridgeManager_1, SkinUtil_1, EgretBridge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-09
     * @modify date 2017-10-09
     *
     * 负责注入的模块
    */
    function EgretSkin(skin) {
        return function (cls) {
            // 监听类型实例化，转换皮肤格式
            ConstructUtil_1.listenConstruct(cls, function (mediator) { return SkinUtil_1.wrapSkin(mediator, skin); });
        };
    }
    exports.EgretSkin = EgretSkin;
    function EgretMediatorClass(target) {
        if (target instanceof Function) {
            // 调用MediatorClass方法
            var cls = Injector_1.MediatorClass(target);
            // 监听类型实例化，赋值表现层桥
            ConstructUtil_1.listenConstruct(cls, function (mediator) { return mediator.bridge = BridgeManager_1.bridgeManager.getBridge(EgretBridge_1.default.TYPE); });
            // 返回结果类型
            return cls;
        }
        else {
            return function (cls) {
                // 调用MediatorClass方法
                cls = Injector_1.MediatorClass(cls);
                // 监听类型实例化，转换皮肤格式
                ConstructUtil_1.listenConstruct(cls, function (mediator) { return SkinUtil_1.wrapSkin(mediator, target); });
                // 返回结果类型
                return cls;
            };
        }
    }
    exports.EgretMediatorClass = EgretMediatorClass;
});
//# sourceMappingURL=Injector.js.map