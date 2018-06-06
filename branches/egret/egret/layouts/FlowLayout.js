import * as tslib_1 from "tslib";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-06-06
 * @modify date 2018-06-06
 *
 * 用于EUI列表的流式布局策略
*/
var FlowLayout = /** @class */ (function (_super) {
    tslib_1.__extends(FlowLayout, _super);
    function FlowLayout(gapH, gapV) {
        if (gapH === void 0) { gapH = 0; }
        if (gapV === void 0) { gapV = 0; }
        var _this = _super.call(this) || this;
        _this.gapH = gapH;
        _this.gapV = gapV;
        Object.defineProperty(_this, "useVirtualLayout", {
            get: function () {
                return false;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        return _this;
    }
    FlowLayout.prototype.updateDisplayList = function (width, height) {
        _super.prototype.updateDisplayList.call(this, width, height);
        if (!this.target)
            return;
        var curX = 0;
        var curY = 0;
        var maxHeightInLine = 0;
        for (var i = 0, len = this.target.numChildren; i < len; i++) {
            var renderer = this.target.getChildAt(i);
            // 判断是否右边超出范围，如果超出了则折行
            if (curX + renderer.width > width) {
                curX = 0;
                curY += maxHeightInLine + this.gapV;
            }
            // 设置横纵坐标
            renderer.x = curX;
            renderer.y = curY;
            // 记录最大高度
            if (renderer.height > maxHeightInLine)
                maxHeightInLine = renderer.height;
            // 累加横坐标
            curX += renderer.width + this.gapH;
        }
    };
    return FlowLayout;
}(eui.BasicLayout));
export default FlowLayout;
