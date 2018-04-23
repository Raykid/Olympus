import MediatorStatus from "olympus-r/engine/mediator/MediatorStatus";
import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import { listenApply } from 'olympus-r/utils/ConstructUtil';
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
    if (!comp && !(skin instanceof egret.DisplayObject)) {
        var compCls = ((mediator.skin instanceof eui.Component && mediator.skin.constructor) || eui.Component);
        comp = new compCls();
        comp.skinName = skin;
        result = comp;
    }
    else {
        result = skin;
    }
    // 判断中介者当前状态
    if (mediator.status < MediatorStatus.OPENING) {
        listenApply(mediator, "onOpen", doWrapSkin);
    }
    else {
        // 直接执行要执行的
        doWrapSkin();
    }
    return result;
    function doWrapSkin() {
        // 场景需要拉伸到与stage同宽高
        if (mediator instanceof SceneMediator) {
            comp.percentWidth = 100;
            comp.percentHeight = 100;
        }
        // 启动引用转发
        if (result instanceof egret.DisplayObjectContainer && comp && comp.skin) {
            // 转发ui引用，如果传入的是显示对象，则需要判断目标是否属于该对象的后裔
            var needJudgeDescendant = (skin instanceof egret.DisplayObjectContainer);
            for (var _i = 0, _a = comp.skin.skinParts; _i < _a.length; _i++) {
                var name = _a[_i];
                var target = comp[name];
                if (!needJudgeDescendant || isDescendant(target, skin))
                    mediator[name] = target;
            }
        }
    }
}
function getComponent(skin) {
    if (!(skin instanceof egret.DisplayObject))
        return null;
    if (skin instanceof eui.Component && skin.skin)
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
