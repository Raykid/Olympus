import DataType from "olympus-r/engine/net/DataType";

/**
 * @author TemplateGenerator
 * @email initial_r@qq.com
 * @modify date 10/9/2017
 * 
 * 测试
*/
export default class Test extends DataType
{
    /**
     * 测试
     * 
     * @type {string}
     * @memberof TestResponse
     */
    public test:string;

    protected doParse(data:any):void
    {
        if(data == null) return;
        this.test = data.test;
    }

    public pack():any
    {
        return {
            test: this.test            
        };
    }
}