import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import SecondModule from "./SecondModule";
import ModuleMessage from "engine/module/ModuleMessage";
import SceneMediator from "engine/scene/SceneMediator";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试首个模块
*/
export default class FirstModule extends Module
{
    @DelegateMediator
    private _mediator:FirstMediator = new FirstMediator();
}

@MediatorClass
@EgretSkin("FuckSkin")
class FirstMediator extends SceneMediator
{
    @Inject
    private moduleManager:ModuleManager;

    public btn:eui.Button;
    public txt:eui.Label;

    public listAssets():string[]
    {
        return ["preload"];
    }

    public onBeforeIn():void
    {
        this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, ()=>{
            this.txt.text = "Fuck you!!!";
            this.moduleManager.open(SecondModule);
        }, this);
    }
    
    @MessageHandler(ModuleMessage.MODULE_CHANGE)
    private onModuleChange(from:any, to:any):void
    {
        if(to == FirstModule) console.log("change to first module!");
        else if(to == SecondModule) console.log("change to second module!");
    }
}