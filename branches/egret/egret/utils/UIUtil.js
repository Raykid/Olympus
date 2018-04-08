/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-17
 * @modify date 2017-10-17
 *
 * UI工具集
*/
import * as tslib_1 from "tslib";
/**
 * 包装EUI的DataGroup组件，使用传入的处理函数处理每个渲染器更新的逻辑
 *
 * @export
 * @param {eui.DataGroup} group 被包装的DataGroup组件
 * @param {(data?:any, renderer?:any)=>void} rendererHandler 渲染器处理函数，每次数据更新时会被调用，处理单个渲染器的渲染逻辑
 * @param {(datas?:eui.ICollection, group?:eui.DataGroup)=>void} [updateHandler] 数据更新处理函数，每次显示更新时会被调用，处理列表显示更新后的渲染逻辑
 */
export function wrapEUIList(group, rendererHandler, updateHandler) {
    group.itemRenderer = ItemRenderer.bind(null, group.itemRendererSkinName, rendererHandler);
    if (updateHandler) {
        // 监听group尺寸是否改变
        var enterFrameHandler = function () {
            if (group.contentWidth > 0 || group.contentHeight > 0) {
                // 移除事件监听
                group.removeEventListener(egret.Event.ENTER_FRAME, enterFrameHandler, this);
                // 调用回调
                updateHandler(group.dataProvider, group);
            }
        };
        group.addEventListener(egret.Event.ENTER_FRAME, enterFrameHandler, this);
    }
}
var ItemRenderer = /** @class */ (function (_super) {
    tslib_1.__extends(ItemRenderer, _super);
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
