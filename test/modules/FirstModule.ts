import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import SecondModule from "./SecondModule";
import ModuleMessage from "engine/module/ModuleMessage";
import Mediator from "engine/mediator/Mediator";
import { ModuleClass, DelegateMediator, Inject, MessageHandler, MediatorClass } from "Injector";

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
    private _mediator:FirstMediator = new FirstMediator();

    public onOpen(data?:any):void
    {
        console.log("first module open");
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
class FirstMediator extends Mediator
{
    @Inject(ModuleManager)
    private moduleManager:ModuleManager;
    
    public constructor()
    {
        var fuck:Fuck = new Fuck();
        super(fuck);
        this.mapListener(fuck.btn, egret.TouchEvent.TOUCH_TAP, ()=>{
            fuck.txt.text = "Fuck you!!!";
            this.moduleManager.open(SecondModule, null, true);
        }, this);
        this.bridge.addChild(this.bridge.sceneLayer, fuck);
    }
}

class Fuck extends eui.Component
{
    public btn:eui.Button;
    public txt:eui.Label;
    
    public constructor()
    {
        super();
        this.skinName = FuckSkin;
    }
}