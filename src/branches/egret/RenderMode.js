define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * 渲染模式枚举
    */
    var RenderMode;
    (function (RenderMode) {
        RenderMode[RenderMode["AUTO"] = 0] = "AUTO";
        RenderMode[RenderMode["CANVAS"] = 1] = "CANVAS";
        RenderMode[RenderMode["WEBGL"] = 2] = "WEBGL";
    })(RenderMode || (RenderMode = {}));
    exports.default = RenderMode;
});
//# sourceMappingURL=RenderMode.js.map