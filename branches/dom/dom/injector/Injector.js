import { listenConstruct } from "olympus-r/utils/ConstructUtil";
import { MediatorClass } from "olympus-r/engine/injector/Injector";
import { wrapSkin } from "../utils/SkinUtil";
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
        skins.unshift(skin);
        listenConstruct(cls, function (mediator) { return wrapSkin(mediator, skins); });
        // 返回结果类型
        return cls;
    };
}
