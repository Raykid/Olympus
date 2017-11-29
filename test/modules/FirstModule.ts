import SecondModule from "./SecondModule";
import TestResponse from "../net/response/TestResponse";
import TestRequest from "../net/request/TestRequest";
import FuckModel, { IFuckModel } from "../models/FuckModel";
import { DOMMediatorClass } from "dom/injector/Injector";
import SceneMediator from "engine/scene/SceneMediator";
import { Inject, MessageHandler } from "core/injector/Injector";
import ModuleManager from "engine/module/ModuleManager";
import { audioManager } from "engine/audio/AudioManager";
import ModuleMessage from "engine/module/ModuleMessage";
import Module from "engine/module/Module";
import { ResponseHandler, ModuleClass, DelegateMediator, ModuleMessageHandler, BindValue, BindOn, BindIf, BindFor } from "engine/injector/Injector";

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
    @BindIf("fuckText == '1234'")
    public btn:HTMLElement
    @BindFor("fuck in fuckList")
    @BindValue({textContent: "fuck + ' - ' + fuckText + ' - 1'"})
    public txt:HTMLElement;

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
            fuckList: [1, 2, "shit", "you"],
            fuckText: "fuck you",
            onClick: ()=>{
                this.viewModel.fuckText = "clicked";
                this.moduleManager.open(SecondModule, null, true);
            }
        };

        audioManager.playMusic({
            url: "./test.mp3"
        });

        setTimeout(()=>{
            this.viewModel.fuckText = "1234";
            this.viewModel.fuckList = ["hello", "world"];
        }, 3000);

        this.dispatchModule(new TestRequest());
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