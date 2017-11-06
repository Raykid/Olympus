import Module from "engine/module/Module";
import ResponseData from "engine/net/ResponseData";
import { moduleManager } from "engine/module/ModuleManager";
import SceneMediator from "engine/scene/SceneMediator";
import { EgretMediatorClass } from "egret/injector/Injector";
import { ModuleClass, DelegateMediator, ModuleMessageHandler, BindMessage } from "engine/injector/Injector";
import { MessageHandler } from "core/injector/Injector";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试第二个模块
*/

@EgretMediatorClass("Fuck2Skin")
class SecondMediator extends SceneMediator
{
    @BindMessage("FuckMsg", {label: "$arguments[0] + ' - 1'"})
    public btn:eui.Button;

    public listAssets():string[]
    {
        return ["preload"];
    }

    public onOpen():void
    {
        this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, ()=>{
            // moduleManager.close(SecondModule);

            this.dispatch("FuckMsg", "Shit!!!");
        });
        // 测试系统消息
        this.dispatch("fuck", 123);
        // 测试模块消息
        this.dispatchModule("fuck", 123);
    }
}

@ModuleClass
export default class SecondModule extends Module
{
    @DelegateMediator
    private _mediator:SecondMediator;
    
    @MessageHandler("fuck")
    @ModuleMessageHandler("fuck")
    private onFuck(a):void
    {
        console.log("message at SecondModule: " + a);
    }
}