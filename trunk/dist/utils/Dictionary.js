import { getObjectHash } from "./ObjectUtil";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-15
 * @modify date 2017-09-15
 *
 * 字典，支持key为任意类型的对象
*/
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this._keyDict = {};
        this._valueDict = {};
    }
    Object.defineProperty(Dictionary.prototype, "size", {
        /**
         * 获取字典内的元素数量
         *
         * @readonly
         * @type {number}
         * @memberof Dictionary
         */
        get: function () {
            var size = 0;
            for (var hash in this._keyDict)
                size++;
            return size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "keys", {
        /**
         * 获取字典key的集合
         *
         * @readonly
         * @type {K[]}
         * @memberof Dictionary
         */
        get: function () {
            var keys = [];
            for (var hash in this._keyDict) {
                keys.push(this._keyDict[hash]);
            }
            return keys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "values", {
        /**
         * 获取字典值的集合
         *
         * @readonly
         * @type {V[]}
         * @memberof Dictionary
         */
        get: function () {
            var values = [];
            for (var hash in this._valueDict) {
                values.push(this._valueDict[hash]);
            }
            return values;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置一个键值对
     *
     * @param {K} key 键
     * @param {V} value 值
     * @memberof Dictionary
     */
    Dictionary.prototype.set = function (key, value) {
        var hash = getObjectHash(key);
        this._keyDict[hash] = key;
        this._valueDict[hash] = value;
    };
    /**
     * 获取一个值
     *
     * @param {K} key 键
     * @returns {V} 值
     * @memberof Dictionary
     */
    Dictionary.prototype.get = function (key) {
        var hash = getObjectHash(key);
        return this._valueDict[hash];
    };
    /**
     * 删除一个键值对
     *
     * @param {K} key 键
     * @memberof Dictionary
     */
    Dictionary.prototype.delete = function (key) {
        var hash = getObjectHash(key);
        delete this._keyDict[hash];
        delete this._valueDict[hash];
    };
    /**
     * 遍历字典
     *
     * @param {(key:K, value:V)=>void} callback 每次遍历的回调
     * @memberof Dictionary
     */
    Dictionary.prototype.forEach = function (callback) {
        for (var hash in this._keyDict) {
            var key = this._keyDict[hash];
            var value = this._valueDict[hash];
            callback(key, value);
        }
    };
    return Dictionary;
}());
export default Dictionary;
