import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import SecondModule from "./SecondModule";
import ModuleMessage from "engine/module/ModuleMessage";
import { ModuleClass, DelegateMediator, Inject, MessageHandler, MediatorClass } from "Injector";
import SceneMediator from "egret/mediator/SceneMediator";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试首个模块
*/
@ModuleClass
export default class FirstModule extends Module
{
    @DelegateMediator
    private _mediator:FirstMediator;

    public onOpen(data?:any):void
    {
        this._mediator = new FirstMediator();
        this._mediator.open(data);
    }

    public onGetResponses(responses:ResponseData[]):void
    {
        console.log("first module gotResponse");
    }

    public onActivate(from:any, data?:any):void
    {
        console.log("first module activate");
    }

    @MessageHandler(ModuleMessage.MODULE_CHANGE)
    private onModuleChange(from:any, to:any):void
    {
        if(to == FirstModule) console.log("change to first module!");
        else if(to == SecondModule) console.log("change to second module!");
    }
}

@MediatorClass
class FirstMediator extends SceneMediator
{
    @Inject(ModuleManager)
    private moduleManager:ModuleManager;

    public btn:eui.Button;
    public txt:eui.Label;

    public listAssets():string[]
    {
        return ["preload"];
    }

    public constructor()
    {
        super(FuckSkin);
    }

    public onBeforeIn():void
    {
        this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, ()=>{
            this.txt.text = "Fuck you!!!";
            this.moduleManager.open(SecondModule, null);
        }, this);
    }
}