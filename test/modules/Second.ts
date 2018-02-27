import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import { BindFunc, BindFor, BindValue, MessageHandler, GlobalMessageHandler, BindMessage, BindIf, SubMediator } from "olympus-r/engine/injector/Injector";
import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";
import TestComp from "./TestComp";
import { moduleManager } from "olympus-r/engine/module/ModuleManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试第二个模块
*/

@EgretMediatorClass("Second", "Fuck2Skin")
export default class Second extends SceneMediator
{
    public static moduleName:string = "Second";

    @SubMediator
    private _testComp:TestComp;

    @BindMessage("FuckMsg", {label: "onMsg($arguments[0])"})
    @BindFunc("getCurrentState", ["fuck", "onMsg", undefined])
    public btn:eui.Button;
    @BindFor("i of fuckList.concat(fuckList).concat(fuckList).concat(fuckList)")
    @BindValue("txt.text", function(scope:any){
        return scope.i;
    })
    @BindFor("lst", "j of fuckList")
    @BindValue({
        txt: {
            text: "'i=' + i + ' & ' + 'j=' + j"
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
            // moduleManager.close(Second);

            this.dispatch("FuckMsg", "Shit!!!");
        });
        this.viewModel = {
            onMsg: msg=>{
                // 表达式里使用函数可以在函数里执行复杂逻辑，并且具有代码提示
                console.log(msg);
                moduleManager.close(this);
                return msg + " - 1";
            },
            fuck: "you",
            fuckList: ["fuck", "shit", "you", "!!!"]
        };
        // 测试消息
        this.dispatch("fuck", 123);
    }

    @MessageHandler("fuck")
    @GlobalMessageHandler("fuck")
    private onFuck(a):void
    {
        console.log("message at Second: " + a);
    }

    @MessageHandler("TestCompMsg")
    private onTestCompMsg():void
    {
        console.log("TestCompMsg Received");
    }

    @GlobalMessageHandler("TestCompMsg")
    private onTestCompMsgGlobal():void
    {
        console.log("TestCompMsg Received Global");
    }
}