import {getObjectHash} from "./ObjectUtil";

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
    private _entity:{[hash:string]:V} = {};

    /**
     * 设置一个键值对
     * 
     * @param {K} key 键
     * @param {V} value 值
     * @memberof Dictionary
     */
    public set(key:K, value:V):void
    {
        this._entity[getObjectHash(key)] = value;
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
        return this._entity[getObjectHash(key)];
    }

    /**
     * 删除一个键值对
     * 
     * @param {K} key 键
     * @memberof Dictionary
     */
    public delete(key:K):void
    {
        delete this._entity[getObjectHash(key)];
    }
}