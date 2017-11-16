import { getObjectHash } from "./ObjectUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-15
 * @modify date 2017-09-15
 * 
 * 字典，支持key为任意类型的对象
*/
export default class Dictionary<K, V>
{
    private _keyDict:{[hash:string]:K} = {};
    private _valueDict:{[hash:string]:V} = {};

    /**
     * 获取字典内的元素数量
     * 
     * @readonly
     * @type {number}
     * @memberof Dictionary
     */
    public get size():number
    {
        var size:number = 0;
        for(var hash in this._keyDict) size ++;
        return size;
    }

    /**
     * 设置一个键值对
     * 
     * @param {K} key 键
     * @param {V} value 值
     * @memberof Dictionary
     */
    public set(key:K, value:V):void
    {
        var hash:string = getObjectHash(key);
        this._keyDict[hash] = key;
        this._valueDict[hash] = value;
    }

    /**
     * 获取一个值
     * 
     * @param {K} key 键
     * @returns {V} 值
     * @memberof Dictionary
     */
    public get(key:K):V
    {
        var hash:string = getObjectHash(key);
        return this._valueDict[hash];
    }

    /**
     * 删除一个键值对
     * 
     * @param {K} key 键
     * @memberof Dictionary
     */
    public delete(key:K):void
    {
        var hash:string = getObjectHash(key);
        delete this._keyDict[hash];
        delete this._valueDict[hash];
    }

    /**
     * 遍历字典
     * 
     * @param {(key:K, value:V)=>void} callback 每次遍历的回调
     * @memberof Dictionary
     */
    public forEach(callback:(key:K, value:V)=>void):void
    {
        for(var hash in this._keyDict)
        {
            var key:K = this._keyDict[hash];
            var value:V = this._valueDict[hash];
            callback(key, value);
        }
    }
}