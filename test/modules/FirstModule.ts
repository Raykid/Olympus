import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import { EgretMediatorClass } from "egret/injector/Injector";
import { Inject, MessageHandler } from "core/injector/Injector";
import { ResponseHandler, ModuleClass, DelegateMediator, ModuleMessageHandler, BindValue, BindOn, BindIf } from "engine/injector/Injector";
import SecondModule from "./SecondModule";
import ModuleMessage from "engine/module/ModuleMessage";
import SceneMediator from "engine/scene/SceneMediator";
import TestResponse from "../net/response/TestResponse";
import TestRequest from "../net/request/TestRequest";
import { bridgeManager } from "engine/bridge/BridgeManager";
import FuckModel, { IFuckModel } from "../models/FuckModel";
import { DOMMediatorClass } from "dom/injector/Injector";
import { audioManager } from "engine/audio/AudioManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试首个模块
*/

@DOMMediatorClass("./modules/test.html")
class FirstMediator extends SceneMediator
{
    @Inject
    private moduleManager:ModuleManager;
    @Inject
    private fuckModel1:FuckModel;
    @Inject
    private fuckModel2:IFuckModel;
    @Inject(1)
    private fuckModel3:IFuckModel;

    @BindOn({click: "onClick"})
    @BindIf({"labelDisplay": "fuckText == '1234'"})
    public btn:eui.Button;
    @BindValue({textContent: "fuckText + ' - 1'"})
    public txt:eui.Label;

    public listAssets():string[]
    {
        return ["./modules/test.html"];
    }

    public onOpen():void
    {
        // this.mapListener(this.btn, "click", function():void
        // {
        //     this.txt.textContent = "Fuck you!!!";
        //     this.moduleManager.open(SecondModule);
        // }, this);
        console.log(this.fuckModel1.fuck, this.fuckModel1 === this.fuckModel2, this.fuckModel1 === this.fuckModel3);

        this.viewModel = {
            fuckText: "fuck you",
            onClick: ()=>{
                this.viewModel.fuckText = "clicked";
                this.moduleManager.open(SecondModule);
            }
        };

        audioManager.playMusic({
            url: "./test.mp3"
        });

        setTimeout(()=>{
            this.viewModel.fuckText = "1234";
        }, 3000);
    }
    
    @MessageHandler(ModuleMessage.MODULE_CHANGE)
    private onModuleChange(to:any, from:any):void
    {
        if(to == FirstModule) console.log("change to first module!");
        else if(to == SecondModule) console.log("change to second module!");
    }

    @ResponseHandler
    private onResponse(res:TestResponse, req:TestRequest):void
    {
        alert("123");
    }
}

@ModuleClass
export default class FirstModule extends Module
{
    @DelegateMediator
    private _mediator:FirstMediator;

    public listJsFiles():string[]
    {
        return ["test1.js", "./test2.js"];
    }
    
    @MessageHandler("fuck")
    @ModuleMessageHandler("fuck")
    private onFuck(a):void
    {
        console.log("message at FirstModule: " + a);
    }
}