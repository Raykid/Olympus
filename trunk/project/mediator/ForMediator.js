import * as tslib_1 from "tslib";
import Mediator from './Mediator';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-05-10
 * @modify date 2018-05-10
 *
 * 集合中介者，可用于@BindFor的变量声明类型
*/
var ForMediator = /** @class */ (function (_super) {
    tslib_1.__extends(ForMediator, _super);
    function ForMediator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ForMediator.prototype, "children", {
        /**
         * 获取渲染器中介者数组
         *
         * @readonly
         * @type {T[]}
         * @memberof ForMediator
         */
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    return ForMediator;
}(Mediator));
export default ForMediator;
