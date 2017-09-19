import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import SecondModule from "./SecondModule";
import ModuleMessage from "engine/module/ModuleMessage";
import { ModuleClass, ResponseHandler, MediatorClass, DelegateMediator } from "engine/injector/Injector";
import { Inject, MessageHandler } from "core/injector/Injector";
import Mediator from "engine/mediator/Mediator";

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
    @Inject(ModuleManager)
    private moduleManager:ModuleManager;

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

        setTimeout(()=>{
            this.moduleManager.open(SecondModule, null, true);
        }, 1000);
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
    public constructor()
    {
        super(document.createElement("a"));
        this.mapListener(this.skin, "click", ()=>{
            console.log("onclick");
        }, this);
        this.skin.textContent = "Fuck";
        this.bridge.htmlWrapper.appendChild(this.skin);
    }
}