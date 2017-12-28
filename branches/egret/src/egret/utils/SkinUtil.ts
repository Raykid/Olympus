import IMediator from "olympus-r/engine/mediator/IMediator";
import SceneMediator from "olympus-r/engine/scene/SceneMediator";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * Egret皮肤工具集
*/
export function wrapSkin(mediator:IMediator, skin:any):eui.Component
{
    var comp:eui.Component = new eui.Component();
    mediator.skin = comp;
    // 篡改mediator的onOpen方法，先于onOpen将皮肤附上去
    var oriFunc:any = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
    mediator.onOpen = function(...args:any[]):void
    {
        comp.skinName = skin;
        // 场景需要拉伸到与stage同宽高
        if(mediator instanceof SceneMediator)
        {
            comp.percentWidth = 100;
            comp.percentHeight = 100;
        }
        // 转发ui引用
        for(var name of comp.skin.skinParts)
        {
            mediator[name] = comp[name];
        }
        // 恢复原始方法
        if(oriFunc) mediator.onOpen = oriFunc;
        else delete mediator.onOpen;
        // 调用原始方法
        mediator.onOpen.apply(this, args);
    };
    return comp;
}