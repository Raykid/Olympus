import IMediator from "olympus-r/engine/mediator/IMediator";
import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import MediatorStatus from "olympus-r/engine/mediator/MediatorStatus";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * Egret皮肤工具集
*/
export function wrapSkin(mediator:IMediator, skin:any):egret.DisplayObject
{
    var result:egret.DisplayObject;
    var comp:eui.Component = getComponent(skin);
    if(!comp && !(skin instanceof egret.DisplayObject))
    {
        var compCls:IConstructor = <IConstructor>((mediator.skin instanceof eui.Component && mediator.skin.constructor) || eui.Component);
        comp = new compCls();
        comp.skinName = skin;
        result = comp;
    }
    else
    {
        result = skin;
    }
    // 判断中介者当前状态
    if(mediator.status < MediatorStatus.OPENED)
    {
        // 篡改mediator的onOpen方法，先于onOpen将皮肤附上去
        var oriFunc:any = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
        mediator.onOpen = function(...args:any[]):any
        {
            doWrapSkin();
            // 恢复原始方法
            if(oriFunc) mediator.onOpen = oriFunc;
            else delete mediator.onOpen;
            // 调用原始方法
            return mediator.onOpen.apply(this, args);
        };
    }
    else
    {
        // 直接执行要执行的
        doWrapSkin();
    }
    return result;

    function doWrapSkin():void
    {
        // 场景需要拉伸到与stage同宽高
        if(mediator instanceof SceneMediator)
        {
            comp.percentWidth = 100;
            comp.percentHeight = 100;
        }
        // 启动引用转发
        if(result instanceof egret.DisplayObjectContainer && comp && comp.skin)
        {
            // 转发ui引用，如果传入的是显示对象，则需要判断目标是否属于该对象的后裔
            var needJudgeDescendant:boolean = (skin instanceof egret.DisplayObjectContainer);
            for(var name of comp.skin.skinParts)
            {
                var target:egret.DisplayObject = comp[name];
                if(!needJudgeDescendant || isDescendant(target, skin))
                    mediator[name] = target;
            }
        }
    }
}

function getComponent(skin:any):eui.Component
{
    if(!(skin instanceof egret.DisplayObject)) return null;
    if(skin instanceof eui.Component && skin.skin) return skin;
    return getComponent(skin.parent);
}

function isDescendant(descendant:egret.DisplayObject, ascendant:egret.DisplayObjectContainer):boolean
{
    return (descendant !== ascendant && contains(descendant, ascendant));
}

function contains(target:egret.DisplayObject, parent:egret.DisplayObjectContainer):boolean
{
    if(!target || !parent) return false;
    if(target === parent) return true;
    return contains(target.parent, parent);
}