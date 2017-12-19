import { listenConstruct } from "olympus-r/utils/ConstructUtil";
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import { wrapSkin } from "../utils/SkinUtil";
import DOMBridge from "../../DOMBridge";
export function DOMMediatorClass() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args[0] instanceof Function) {
        // 调用MediatorClass方法
        var cls = MediatorClass(args[0]);
        // 监听类型实例化，赋值表现层桥
        listenConstruct(cls, function (mediator) { return mediator.bridge = bridgeManager.getBridge(DOMBridge.TYPE); });
        // 返回结果类型
        return cls;
    }
    else {
        return function (cls) {
            // 调用MediatorClass方法
            cls = MediatorClass(cls);
            // 监听类型实例化，转换皮肤格式
            listenConstruct(cls, function (mediator) { return wrapSkin(mediator, args); });
            // 返回结果类型
            return cls;
        };
    }
}
