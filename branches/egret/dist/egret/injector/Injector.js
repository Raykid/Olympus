import { listenConstruct } from "olympus-r/utils/ConstructUtil";
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import { wrapSkin } from "../utils/SkinUtil";
import EgretBridge from "../../EgretBridge";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 *
 * 负责注入的模块
*/
export function EgretSkin(skin) {
    return function (cls) {
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, function (mediator) { return wrapSkin(mediator, skin); });
    };
}
export function EgretMediatorClass(target) {
    if (target instanceof Function) {
        // 调用MediatorClass方法
        var cls = MediatorClass(target);
        // 监听类型实例化，赋值表现层桥
        listenConstruct(cls, function (mediator) { return mediator.bridge = bridgeManager.getBridge(EgretBridge.TYPE); });
        // 返回结果类型
        return cls;
    }
    else {
        return function (cls) {
            // 调用MediatorClass方法
            cls = MediatorClass(cls);
            // 监听类型实例化，转换皮肤格式
            listenConstruct(cls, function (mediator) { return wrapSkin(mediator, target); });
            // 返回结果类型
            return cls;
        };
    }
}
