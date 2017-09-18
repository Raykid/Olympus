import Module from "engine/module/Module";
import ModuleManager from "engine/module/ModuleManager";
import ResponseData from "engine/net/ResponseData";
import SecondModule from "./SecondModule";

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
}