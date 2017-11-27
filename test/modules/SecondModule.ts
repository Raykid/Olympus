import SceneMediator from "engine/scene/SceneMediator";
import Module from "engine/module/Module";
import { MessageHandler } from "core/injector/Injector";
import { BindModuleMessage, ModuleClass, DelegateMediator, ModuleMessageHandler, BindFunc, BindFor, BindValue } from "engine/injector/Injector";
import { EgretMediatorClass } from "egret/injector/Injector";

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
    @BindModuleMessage("FuckMsg", {label: "onMsg($arguments[0])"})
    @BindFunc("getCurrentState", ["fuck", "onMsg", undefined])
    public btn:eui.Button;
    @BindFor("i in fuckList")
    @BindValue("txt.text", "i")
    @BindFor("lst", "value of fuckList")
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

            this.dispatchModule("FuckMsg", "Shit!!!");
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
        // 测试系统消息
        this.dispatch("fuck", 123);
        // 测试模块消息
        this.dispatchModule("fuck", 123);
    }
}

@ModuleClass
export default class SecondModule extends Module
{
    @DelegateMediator
    private _mediator:SecondMediator;
    
    @MessageHandler("fuck")
    @ModuleMessageHandler("fuck")
    private onFuck(a):void
    {
        console.log("message at SecondModule: " + a);
    }
}