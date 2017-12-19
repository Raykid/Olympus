import { core } from "../Core";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 *
 * 内核命令类，内核命令在注册了消息后可以在消息派发时被执行
*/
var Command = /** @class */ (function () {
    function Command(msg) {
        this.msg = msg;
    }
    Command.prototype.dispatch = function (typeOrMsg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        core.dispatch.apply(core, [typeOrMsg].concat(params));
    };
    return Command;
}());
export default Command;
