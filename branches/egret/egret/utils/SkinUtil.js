import SceneMediator from "olympus-r/engine/scene/SceneMediator";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 *
 * Egret皮肤工具集
*/
export function wrapSkin(mediator, skin) {
    var result;
    var comp = getComponent(skin);
    if (!comp) {
        comp = new eui.Component();
        comp.skinName = skin;
        result = comp;
    }
    else {
        result = skin;
    }
    // 篡改mediator的onOpen方法，先于onOpen将皮肤附上去
    var oriFunc = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
    mediator.onOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 场景需要拉伸到与stage同宽高
        if (mediator instanceof SceneMediator) {
            comp.percentWidth = 100;
            comp.percentHeight = 100;
        }
        // 转发ui引用，如果传入的是显示对象，则需要判断目标是否属于该对象的后裔
        var needJudgeDescendant = (skin instanceof egret.DisplayObjectContainer);
        for (var _a = 0, _b = comp.skin.skinParts; _a < _b.length; _a++) {
            var name = _b[_a];
            var target = comp[name];
            if (!needJudgeDescendant || isDescendant(target, skin))
                mediator[name] = target;
        }
        // 恢复原始方法
        if (oriFunc)
            mediator.onOpen = oriFunc;
        else
            delete mediator.onOpen;
        // 调用原始方法
        mediator.onOpen.apply(this, args);
    };
    return result;
}
function getComponent(skin) {
    if (!(skin instanceof egret.DisplayObject))
        return null;
    if (skin instanceof eui.Component)
        return skin;
    return getComponent(skin.parent);
}
function isDescendant(descendant, ascendant) {
    return (descendant !== ascendant && contains(descendant, ascendant));
}
function contains(target, parent) {
    if (!target || !parent)
        return false;
    if (target === parent)
        return true;
    return contains(target.parent, parent);
}
