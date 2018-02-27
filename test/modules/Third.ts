import Second from "./Second";
import TestResponse from "../net/response/TestResponse";
import TestRequest from "../net/request/TestRequest";
import FuckModel, { IFuckModel } from "../models/FuckModel";
import SceneMediator from 'olympus-r/engine/scene/SceneMediator';
import { Inject } from "olympus-r/core/injector/Injector";
import ModuleManager from "olympus-r/engine/module/ModuleManager";
import ModuleMessage from "olympus-r/engine/module/ModuleMessage";
import { BindOn, BindIf, BindFor, BindValue, MessageHandler, GlobalMessageHandler, ResponseHandler } from "olympus-r/engine/injector/Injector";
import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { audioManager } from "olympus-r/engine/audio/AudioManager";
import TestPanel from "./TestPanel";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试首个模块
*/

@DOMMediatorClass("Third", "./modules/test.html")
export default class Third extends SceneMediator
{
    public static moduleName:string = "Third";

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
    @BindFor("fuck in fuckList")
    @BindValue({textContent: "fuck + ' - ' + fuckText + ' - 1'"})
    @BindOn("click", "onClickText")
    public txt:HTMLElement;
    @BindOn("click", "onClickFuck")
    @BindValue("textContent", "fuckModel.fuck")
    public fuck:HTMLElement;

    public listAssets():string[]
    {
        return ["./modules/test.html"];
    }

    public onOpen():void
    {
        this.viewModel = {
            fuckList: [1, 2, "shit", "you"],
            fuckText: "fuck you",
            onClickBtn: ()=>{
                this.viewModel.fuckText = "clicked";
                this.moduleManager.open(Second, null, true);
            },
            onClickText: ()=>{
                this.moduleManager.open(TestPanel);
            },
            onClickFuck: ()=>{
                this.moduleManager.close(Third);
            },
            fuckModel: this.fuckModel1
        };
    }
}