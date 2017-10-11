import IMediator from "engine/mediator/IMediator";

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
    // 篡改mediator的onLoadAssets方法，在资源加载完毕时将皮肤附上去
    var oriFunc:(err?: Error)=>void = mediator.onLoadAssets;
    mediator.onLoadAssets = function(err?:Error):void
    {
        if(!err)
        {
            comp.skinName = skin;
            // 转发ui引用
            for(var name of comp.skin.skinParts)
            {
                mediator[name] = comp[name];
            }
        }
        // 恢复onLoadAssets方法
        mediator.onLoadAssets = oriFunc;
        // 调用原始方法
        mediator.onLoadAssets(err);
    };
    return comp;
}