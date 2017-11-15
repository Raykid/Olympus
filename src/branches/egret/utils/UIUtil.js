/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-17
 * @modify date 2017-10-17
 *
 * UI工具集
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * 包装EUI的DataGroup组件，使用传入的处理函数处理每个渲染器更新的逻辑
     *
     * @export
     * @param {eui.DataGroup} group 被包装的DataGroup组件
     * @param {(data?:any, renderer?:any)=>void} rendererHandler 渲染器处理函数，每次数据更新时会被调用
     */
    function wrapEUIList(group, rendererHandler) {
        group.itemRenderer = ItemRenderer.bind(null, group.itemRendererSkinName, rendererHandler);
    }
    exports.wrapEUIList = wrapEUIList;
    var ItemRenderer = /** @class */ (function (_super) {
        __extends(ItemRenderer, _super);
        function ItemRenderer(skinName, rendererHandler) {
            var _this = _super.call(this) || this;
            _this.skinName = skinName;
            _this._rendererHandler = rendererHandler;
            return _this;
        }
        ItemRenderer.prototype.dataChanged = function () {
            _super.prototype.dataChanged.call(this);
            this._rendererHandler(this.data, this);
        };
        return ItemRenderer;
    }(eui.ItemRenderer));
});
//# sourceMappingURL=UIUtil.js.map