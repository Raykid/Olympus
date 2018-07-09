/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 这个文件的存在是为了对现有js功能打补丁修bug等
*/
/** 修复Array.findIndex会被遍历到的问题 */
if (Array.prototype.hasOwnProperty("findIndex")) {
    var desc = Object.getOwnPropertyDescriptor(Array.prototype, "findIndex");
    if (desc.enumerable) {
        desc.enumerable = false;
        Object.defineProperty(Array.prototype, "findIndex", desc);
    }
}
/** 为某些不支持ErrorEvent的浏览器添加ErrorEvent支持 */
try {
    new ErrorEvent("");
}
catch (err) {
    window["ErrorEvent"] = function ErrorEvent(type, errorEventInitDict) {
        if (!errorEventInitDict)
            errorEventInitDict = {};
        if (Event instanceof Function) {
            Event.call(this, type, errorEventInitDict);
            this.initErrorEvent(type, errorEventInitDict.bubbles, errorEventInitDict.cancelable, errorEventInitDict.message, errorEventInitDict.filename, errorEventInitDict.lineno);
            this.error = errorEventInitDict.error;
            return this;
        }
        else {
            var evt = document.createEvent("ErrorEvent");
            evt.initErrorEvent(type, errorEventInitDict.bubbles, errorEventInitDict.cancelable, errorEventInitDict.message, errorEventInitDict.filename, errorEventInitDict.lineno);
            return evt;
        }
    };
    window["ErrorEvent"].prototype.initErrorEvent = function initErrorEvent(typeArg, canBubbleArg, cancelableArg, messageArg, filenameArg, linenoArg) {
        this.type = typeArg;
        this.bubbles = canBubbleArg;
        this.cancelable = cancelableArg;
        this.message = messageArg;
        this.filename = filenameArg;
        this.lineno = linenoArg;
    };
}
/** 篡改Reflect.decorate方法，用于为装饰器方法打个flag，标记装饰器是否为参数化装饰 */
export var decorateThis = {};
if (Reflect && Reflect.decorate) {
    var oriDecorate = Reflect.decorate;
    Reflect.decorate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 篡改args[0][0]（装饰器方法引用），在调用时为其提供一个this指向，指向window
        var oriRef = args[0][0];
        args[0][0] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return oriRef.apply(decorateThis, args);
        };
        // 调用原始方法
        var result = oriDecorate.apply(this, args);
        // 还原篡改项
        args[0][0] = oriRef;
        // 返回结果
        return result;
    };
}
