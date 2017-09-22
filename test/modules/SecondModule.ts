import Module from "engine/module/Module";
import ResponseData from "engine/net/ResponseData";
import { ModuleClass, DelegateMediator, MediatorClass } from "Injector";
import SceneMediator from "egret/mediator/SceneMediator";
import { moduleManager } from "engine/module/ModuleManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试第二个模块
*/
@ModuleClass
export default class SecondModule extends Module
{
    @DelegateMediator
    private _mediator:SecondMediator;

    public onOpen(data?:any):void
    {
        this._mediator = new SecondMediator();
        this._mediator.open(data);
    }

    public onGetResponses(responses:ResponseData[]):void
    {
        console.log("second module gotResponse");
    }

    public onActivate(from:any, data?:any):void
    {
        console.log("second module activate");
    }

    public onClose(data?:any):void
    {
        this._mediator.close(data);
    }
}

@MediatorClass
class SecondMediator extends SceneMediator
{
    public btn:eui.Button;

    public constructor()
    {
        super(Fuck2Skin);
    }

    public onBeforeIn():void
    {
        this.mapListener(this.btn, egret.TouchEvent.TOUCH_TAP, ()=>{
            moduleManager.close(SecondModule);
        });
    }
}