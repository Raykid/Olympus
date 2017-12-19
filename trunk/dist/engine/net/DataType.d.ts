/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 请求或返回数据结构体
*/
export default abstract class DataType {
    /**
     * 原始数据
     *
     * @type {*}
     * @memberof DataType
     */
    __rawData: any;
    /**
     * 解析后端返回的JSON对象，生成结构体
     *
     * @param {any} data 后端返回的JSON对象
     * @returns {DataType} 结构体对象
     * @memberof DataType
     */
    parse(data: any): DataType;
    /**
     * 解析逻辑，需要子类实现
     *
     * @protected
     * @abstract
     * @param {*} data JSON对象
     * @return {*} 处理过后的原始数据要还给框架记录
     * @memberof DataType
     */
    protected abstract doParse(data: any): any;
    /**
     * 打包数据成为一个Object，需要子类实现
     *
     * @returns {*} 打包后的数据
     * @memberof DataType
     */
    abstract pack(): any;
}
