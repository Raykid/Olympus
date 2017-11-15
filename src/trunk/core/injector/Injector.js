define(["require", "exports", "../Core", "../../utils/ConstructUtil", "../message/Message"], function (require, exports, Core_1, ConstructUtil_1, Message_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * Core模组的装饰器注入模块
    */
    /** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
    function Injectable() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this === undefined) {
            // 不需要转换注册类型，直接注册
            Core_1.core.mapInject(args[0]);
        }
        else {
            // 需要转换注册类型，需要返回一个ClassDecorator
            return function (realCls) {
                for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                    var cls = args_1[_i];
                    // 注入类型
                    Core_1.core.mapInject(realCls, cls);
                }
                // 需要转换的也要额外将自身注入一个
                Core_1.core.mapInject(realCls);
            };
        }
    }
    exports.Injectable = Injectable;
    ;
    function Inject(target, key) {
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
    exports.Inject = Inject;
    ;
    function doInject(cls, key, type) {
        // 监听实例化
        var target;
        ConstructUtil_1.listenConstruct(cls, function (instance) {
            Object.defineProperty(instance, key, {
                configurable: true,
                enumerable: true,
                get: function () { return target || (target = Core_1.core.getInject(type)); }
            });
        });
    }
    function MessageHandler(target, key) {
        if (key) {
            var defs = Reflect.getMetadata("design:paramtypes", target, key);
            var resClass = defs[0];
            if (!(resClass.prototype instanceof Message_1.default))
                throw new Error("@MessageHandler装饰器装饰的方法的首个参数必须是Message");
            doMessageHandler(target.constructor, key, resClass);
        }
        else {
            return function (prototype, propertyKey, descriptor) {
                doMessageHandler(prototype.constructor, propertyKey, target);
            };
        }
    }
    exports.MessageHandler = MessageHandler;
    ;
    function doMessageHandler(cls, key, type) {
        // 监听实例化
        ConstructUtil_1.listenConstruct(cls, function (instance) {
            Core_1.core.listen(type, instance[key], instance);
        });
        // 监听销毁
        ConstructUtil_1.listenDispose(cls, function (instance) {
            Core_1.core.unlisten(type, instance[key], instance);
        });
    }
});
//# sourceMappingURL=Injector.js.map