/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 * 
 * 请求或返回数据结构体
*/
export default abstract class DataType
{
    private __rawData:any;

    /**
     * 解析后端返回的JSON对象，生成结构体
     * 
     * @param {any} data 后端返回的JSON对象
     * @returns {DataType} 结构体对象
     * @memberof DataType
     */
    public parse(data:any):DataType
    {
        this.__rawData = data;
        this.doParse(data);
        return this;
    }
    
    /**
     * 解析逻辑，需要子类实现
     * 
     * @protected
     * @abstract
     * @param {*} data JSON对象
     * @memberof DataType
     */
    protected abstract doParse(data:any):void;
    
    /**
     * 打包数据成为一个Object，需要子类实现
     * 
     * @returns {*} 打包后的数据
     * @memberof DataType
     */
    public abstract pack():any;
}