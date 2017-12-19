/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-15
 * @modify date 2017-09-15
 *
 * 字典，支持key为任意类型的对象
*/
export default class Dictionary<K, V> {
    private _keyDict;
    private _valueDict;
    /**
     * 获取字典内的元素数量
     *
     * @readonly
     * @type {number}
     * @memberof Dictionary
     */
    readonly size: number;
    /**
     * 获取字典key的集合
     *
     * @readonly
     * @type {K[]}
     * @memberof Dictionary
     */
    readonly keys: K[];
    /**
     * 获取字典值的集合
     *
     * @readonly
     * @type {V[]}
     * @memberof Dictionary
     */
    readonly values: V[];
    /**
     * 设置一个键值对
     *
     * @param {K} key 键
     * @param {V} value 值
     * @memberof Dictionary
     */
    set(key: K, value: V): void;
    /**
     * 获取一个值
     *
     * @param {K} key 键
     * @returns {V} 值
     * @memberof Dictionary
     */
    get(key: K): V;
    /**
     * 删除一个键值对
     *
     * @param {K} key 键
     * @memberof Dictionary
     */
    delete(key: K): void;
    /**
     * 遍历字典
     *
     * @param {(key:K, value:V)=>void} callback 每次遍历的回调
     * @memberof Dictionary
     */
    forEach(callback: (key: K, value: V) => void): void;
}
