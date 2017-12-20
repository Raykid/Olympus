import Test from "../type/Test";
import ResponseData, { IResponseParams } from "olympus-r/engine/net/ResponseData";
import { netManager } from "olympus-r/engine/net/NetManager";

/**
 * @author TemplateGenerator
 * @email initial_r@qq.com
 * @modify date 10/9/2017
 * 
 * 测试
*/
export default class TestResponse extends ResponseData
{
    /**
     * 测试
     * 
     * @type {Test}
     * @memberof TestResponse
     */
    public test:Test;

    public get __params():IResponseParams
    {
        return {
            type: "Test",
            protocol: "http",
            method: "GET"
        };
    };

    public static type:string = "Test";

    protected doParse(data:any):void
    {
        if(data == null) return;
        this.__params.success = data.success;
        this.test = <Test>new Test().parse(data.test);
    }

    public pack():any
    {
        return {
            test: this.test.pack()            
        };
    }
}

/** 注册返回体 */
netManager.registerResponse(TestResponse);