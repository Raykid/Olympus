import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { Inject } from "olympus-r/core/injector/Injector";
import { audioManager } from "olympus-r/engine/audio/AudioManager";
import { BindFor, BindIf, BindOn, BindValue, GlobalMessageHandler, MessageHandler, ResponseHandler } from "olympus-r/engine/injector/Injector";
import ModuleManager from "olympus-r/engine/module/ModuleManager";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import SceneMediator from 'olympus-r/engine/scene/SceneMediator';
import FuckModel, { IFuckModel } from "../models/FuckModel";
import TestRequest from "../net/request/TestRequest";
import TestResponse from "../net/response/TestResponse";
import Second from "./Second";
import TestForMediator from "./TestForMediator";
import Third from "./Third";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试首个模块
*/

@DOMMediatorClass("First", "./modules/test.html")
export default class First extends SceneMediator
{
    public static moduleName:string = "First";

    @Inject
    private moduleManager:ModuleManager;
    @Inject
    private fuckModel1:FuckModel;
    @Inject
    private fuckModel2:IFuckModel;
    @Inject(1)
    private fuckModel3:IFuckModel;

    @BindOn({click: "onClickBtn"})
    @BindIf("fuckText == '1234'")
    public btn:HTMLElement
    @BindFor("fuck of fuckList", TestForMediator)
    public txt:HTMLElement;
    @BindOn("click", "onClickFuck")
    @BindValue("textContent", "fuckModel.fuck")
    public fuck:HTMLElement;

    public listAssets():string[]
    {
        return ["./modules/test.html"];
    }

    public listJsFiles():string[]
    {
        return ["test1.js", "./test2.js"];
    }

    public onOpen():void
    {
        // this.mapListener(this.btn, "click", function():void
        // {
        //     this.txt.textContent = "Fuck you!!!";
        //     this.moduleManager.open(Second);
        // }, this);
        console.log(this.fuckModel1.fuck, this.fuckModel1 === this.fuckModel2, this.fuckModel1 === this.fuckModel3);

        this.viewModel = {
            fuckList: [1, 2, "shit", "you"],
            fuckText: "fuck you",
            onClickBtn: ()=>{
                this.viewModel.fuckText = "clicked";
                // this.moduleManager.open(Second);
                new Second().open();
            },
            onClickFuck: ()=>{
                this.moduleManager.open(Third);
            },
            fuckModel: this.fuckModel1
        };

        audioManager.playMusic({
            url: "./test.mp3"
        });

        setTimeout(()=>{
            this.viewModel.fuckText = "1234";
            // this.viewModel.fuckList = ["hello", "world"];
            this.viewModel.fuckList.push("jfksdjlf");
            this.fuckModel1.fuck = "You!!!";
        }, 3000);

        this.dispatch(new TestRequest());
    }
    
    @MessageHandler(ModuleMessage.MODULE_CHANGE)
    private onModuleChange(to:any, from:any):void
    {
        if(to == First) console.log("change to first module!");
        else if(to == Second) console.log("change to second module!");
    }

    @ResponseHandler
    private onResponse(res:TestResponse, req:TestRequest):void
    {
        alert("123");
    }
    
    @MessageHandler("fuck")
    @GlobalMessageHandler("fuck")
    private onFuck(a):void
    {
        console.log("message at FirstModule: " + a);
    }
}