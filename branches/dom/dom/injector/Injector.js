import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import { listenConstruct, listenApply } from "olympus-r/utils/ConstructUtil";
import DOMBridge from "../../DOMBridge";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 *
 * 负责注入的模块
*/
export function DOMMediatorClass(moduleName, skin) {
    var skins = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        skins[_i - 2] = arguments[_i];
    }
    return function (cls) {
        // 调用MediatorClass方法
        cls = MediatorClass(moduleName)(cls);
        // 监听类型实例化，转换皮肤格式
        var finalSkin;
        if (skins.length === 0) {
            finalSkin = skin;
        }
        else {
            skins.unshift(skin);
            finalSkin = skins;
        }
        listenConstruct(cls, function (mediator) {
            // 先赋值桥
            mediator.bridge = bridgeManager.getBridge(DOMBridge.TYPE);
            // 然后监听onOpen，在onOpen中设置皮肤
            listenApply(mediator, "onOpen", function (mediator) {
                mediator.skin = finalSkin;
            });
        });
        // 返回结果类型
        return cls;
    };
}
