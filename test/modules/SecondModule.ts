import Module from "engine/module/Module";
import ResponseData from "engine/net/ResponseData";
import { moduleManager } from "engine/module/ModuleManager";
import SceneMediator from "engine/scene/SceneMediator";
import { EgretMediatorClass } from "egret/injector/Injector";
import { ModuleClass, DelegateMediator } from "engine/injector/Injector";

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
    public btn:eui.Button;

    public listAssets():string[]
    {
        return ["preload"];
    }

    public onOpen():void
    {
        this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, ()=>{
            moduleManager.close(SecondModule);
        });
    }
}

@ModuleClass
export default class SecondModule extends Module
{
    @DelegateMediator
    private _mediator:SecondMediator;
}