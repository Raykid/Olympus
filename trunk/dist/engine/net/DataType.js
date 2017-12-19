/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-11
 * @modify date 2017-09-11
 *
 * 请求或返回数据结构体
*/
var DataType = /** @class */ (function () {
    function DataType() {
    }
    /**
     * 解析后端返回的JSON对象，生成结构体
     *
     * @param {any} data 后端返回的JSON对象
     * @returns {DataType} 结构体对象
     * @memberof DataType
     */
    DataType.prototype.parse = function (data) {
        this.__rawData = this.doParse(data);
        return this;
    };
    return DataType;
}());
export default DataType;
