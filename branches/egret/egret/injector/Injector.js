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
export function EgretSkin(skin) {
    return function (cls) {
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, function (mediator) { return wrapSkin(mediator, skin); });
    };
}
export function EgretMediatorClass(moduleName, skin) {
    return function (cls) {
        // 调用MediatorClass方法
        cls = MediatorClass(moduleName)(cls);
        // 监听类型实例化，转换皮肤格式
        listenConstruct(cls, function (mediator) { return wrapSkin(mediator, skin); });
        // 返回结果类型
        return cls;
    };
}
