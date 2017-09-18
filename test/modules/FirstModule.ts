import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import SecondModule from "./SecondModule";
import ModuleMessage from "engine/module/ModuleMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 * 
 * 测试首个模块
*/
@module
export default class FirstModule extends Module
{
    @inject(ModuleManager)
    private moduleManager:ModuleManager;

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
            this.moduleManager.open(SecondModule);
        }, 1000);
    }

    @handler(ModuleMessage.MODULE_CHANGE)
    private onSwitchIn(from:any, to:any):void
    {
        if(to == FirstModule) console.log("change to first module!");
        else if(to == SecondModule) console.log("change to second module!");
    }
}