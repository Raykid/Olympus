define(["require", "exports", "../../../trunk/engine/scene/SceneMediator"], function (require, exports, SceneMediator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-10-09
     * @modify date 2017-10-09
     *
     * Egret皮肤工具集
    */
    function wrapSkin(mediator, skin) {
        var comp = new eui.Component();
        mediator.skin = comp;
        // 篡改mediator的onOpen方法，先于onOpen将皮肤附上去
        var oriFunc = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
        mediator.onOpen = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            comp.skinName = skin;
            // 场景需要拉伸到与stage同宽高
            if (mediator instanceof SceneMediator_1.default) {
                comp.width = mediator.bridge.root.stage.stageWidth;
                comp.height = mediator.bridge.root.stage.stageHeight;
            }
            // 转发ui引用
            for (var _a = 0, _b = comp.skin.skinParts; _a < _b.length; _a++) {
                var name = _b[_a];
                mediator[name] = comp[name];
            }
            // 恢复原始方法
            if (oriFunc)
                mediator.onOpen = oriFunc;
            else
                delete mediator.onOpen;
            // 调用原始方法
            mediator.onOpen.apply(this, args);
        };
        return comp;
    }
    exports.wrapSkin = wrapSkin;
});
//# sourceMappingURL=SkinUtil.js.map