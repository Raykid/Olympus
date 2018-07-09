import * as tslib_1 from "tslib";
import Observable from '../../../kernel/observable/Observable';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-31
 * @modify date 2017-10-31
 *
 * 可观察接口的默认实现对象，会将收到的消息通知给注册的回调
*/
var ObservableExt = /** @class */ (function (_super) {
    tslib_1.__extends(ObservableExt, _super);
    function ObservableExt() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._commandDict = {};
        return _this;
    }
    ObservableExt.prototype.handleCommands = function (msg) {
        var commands = this._commandDict[msg.__type];
        if (commands) {
            commands = commands.concat();
            for (var _i = 0, commands_1 = commands; _i < commands_1.length; _i++) {
                var cls = commands_1[_i];
                // 执行命令
                new cls(msg).exec();
            }
        }
    };
    ObservableExt.prototype.handleMessages = function (msg) {
        // 在此之前先处理Command
        this.handleCommands(msg);
        _super.prototype.handleMessages.call(this, msg);
    };
    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     *
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Observable
     */
    ObservableExt.prototype.mapCommand = function (type, cmd) {
        // 销毁判断
        if (this._disposed)
            return;
        var commands = this._commandDict[type];
        if (!commands)
            this._commandDict[type] = commands = [];
        if (commands.indexOf(cmd) < 0)
            commands.push(cmd);
    };
    /**
     * 注销命令
     *
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void}
     * @memberof Observable
     */
    ObservableExt.prototype.unmapCommand = function (type, cmd) {
        // 销毁判断
        if (this._disposed)
            return;
        var commands = this._commandDict[type];
        if (!commands)
            return;
        var index = commands.indexOf(cmd);
        if (index < 0)
            return;
        commands.splice(index, 1);
    };
    /** 销毁 */
    ObservableExt.prototype.dispose = function () {
        // 清空所有命令
        this._commandDict = null;
        // 调用基类方法
        _super.prototype.dispose.call(this);
    };
    return ObservableExt;
}(Observable));
export default ObservableExt;
