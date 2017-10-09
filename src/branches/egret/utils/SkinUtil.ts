/// <reference path="../egret-libs/eui/eui.d.ts"/>
/// <reference path="../../../../dist/Olympus.d.ts"/>

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
    // 监听添加舞台事件，将皮肤贴上去
    comp.addEventListener(egret.Event.ADDED_TO_STAGE, onAddedToStage, this);
    return comp;

    function onAddedToStage(event:egret.Event):void
    {
        comp.removeEventListener(egret.Event.ADDED_TO_STAGE, onAddedToStage, this);
        comp.skinName = skin;
        // 转发ui引用
        for(var key in comp)
        {
            var target:any = comp[key];
            if(
                target instanceof eui.Component ||
                target instanceof eui.Image ||
                target instanceof eui.Label ||
                target instanceof eui.EditableText ||
                target instanceof eui.BitmapLabel ||
                target instanceof eui.sys.UIComponentImpl
            )
            {
                mediator[key] = target;
            }
        }
    }
}