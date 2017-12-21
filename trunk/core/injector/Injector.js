import { core } from "../Core";
import { decorateThis } from "../global/Patch";
import { listenConstruct } from "../../utils/ConstructUtil";
import "reflect-metadata";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 *
 * Core模组的装饰器注入模块
*/
/** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
export function Injectable() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (this === decorateThis) {
        // 不需要转换注册类型，直接注册
        core.mapInject(args[0]);
    }
    else {
        // 需要转换注册类型，需要返回一个ClassDecorator
        return function (realCls) {
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var cls = args_1[_i];
                // 注入类型
                core.mapInject(realCls, cls);
            }
            // 需要转换的也要额外将自身注入一个
            core.mapInject(realCls);
        };
    }
}
;
export function Inject(target, key) {
    if (key) {
        var cls = Reflect.getMetadata("design:type", target, key);
        doInject(target.constructor, key, cls);
    }
    else {
        return function (prototype, propertyKey) {
            doInject(prototype.constructor, propertyKey, target);
        };
    }
}
;
function doInject(cls, key, type) {
    // 监听实例化
    var target;
    listenConstruct(cls, function (instance) {
        Object.defineProperty(instance, key, {
            configurable: true,
            enumerable: true,
            get: function () { return target || (target = core.getInject(type)); }
        });
    });
}
