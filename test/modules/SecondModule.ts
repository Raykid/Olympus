import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import Module from "olympus-r/engine/module/Module";
import { ModuleClass, DelegateMediator, BindFunc, BindFor, BindValue, MessageHandler, GlobalMessageHandler, BindMessage, BindIf } from "olympus-r/engine/injector/Injector";
import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";

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
    @BindMessage("FuckMsg", {label: "onMsg($arguments[0])"})
    @BindFunc("getCurrentState", ["fuck", "onMsg", undefined])
    public btn:eui.Button;
    @BindFor("i in fuckList")
    @BindValue("txt.text", "i")
    @BindFor("lst", "key in fuckList")
    @BindValue({
        txt: {
            text: "$target.$hashCode"
        }
    })
    public lst:eui.DataGroup;

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
        this.viewModel = {
            onMsg: msg=>{
                // 表达式里使用函数可以在函数里执行复杂逻辑，并且具有代码提示
                console.log(msg);
                return msg + " - 1";
            },
            fuck: "you",
            fuckList: ["fuck", "shit", "you", "!!!"]
        };
        // 测试消息
        this.dispatch("fuck", 123);
    }
}

@ModuleClass
export default class SecondModule extends Module
{
    @DelegateMediator
    private _mediator:SecondMediator;
    
    @MessageHandler("fuck")
    @GlobalMessageHandler("fuck")
    private onFuck(a):void
    {
        console.log("message at SecondModule: " + a);
    }
}