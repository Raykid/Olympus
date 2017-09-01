/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 任意构造器接口
*/
export interface Constructor extends Function
{
    new (...args:any[]):any;
}