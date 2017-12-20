import TestResponse from "../response/TestResponse";
import RequestData, { IRequestParams } from "olympus-r/engine/net/RequestData";
import IRequestPolicy from "olympus-r/engine/net/IRequestPolicy";
import policy from "olympus-r/engine/net/policies/HTTPRequestPolicy";

/**
 * @author TemplateGenerator
 * @email initial_r@qq.com
 * @modify date 10/9/2017
 * 
 * 测试
*/
export default class TestRequest extends RequestData
{
    /**
     * 测试
     * 
     * @type {string}
     * @memberof TestRequest
     */
    public test:string;

    public get __params():IRequestParams
    {
        return {
            type: "Test",
			path: "/test",
            protocol: "http",
            response: TestResponse,
            data: {
                test: this.test// string - 测试
            }
        };
    };
    public __policy:IRequestPolicy = policy;
}