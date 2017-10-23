import IMediator from "engine/mediator/IMediator";
import SceneMediator from "engine/scene/SceneMediator";

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
    // 在资源加载完毕时将皮肤附上去
    mediator.whenLoadAssets(function(err?:Error):void
    {
        if(!err)
        {
            comp.skinName = skin;
            // 场景需要拉伸到与stage同宽高
            if(mediator instanceof SceneMediator)
            {
                comp.width = mediator.bridge.root.stage.stageWidth;
                comp.height = mediator.bridge.root.stage.stageHeight;
            }
            // 转发ui引用
            for(var name of comp.skin.skinParts)
            {
                mediator[name] = comp[name];
            }
        }
    });
    return comp;
}