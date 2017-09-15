/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 * 
 * 同步工具集，用于对多个
*/
var _cache:{[name:string]:SyncContext} = {};

/**
 * 判断是否正在进行操作
 * 
 * @export
 * @param {string} name 队列名
 * @returns {boolean} 队列是否正在操作
 */
export function isOperating(name:string):boolean
{
    var ctx:SyncContext = _cache[name];
    return (ctx != null && ctx.operating);
}

/**
 * 开始同步操作，所有传递了相同name的操作会被以队列方式顺序执行
 * 
 * @export
 * @param name 一个队列的名字
 * @param {Function} fn 要执行的方法
 * @param {*} [thisArg] 方法this对象
 * @param {...any[]} [args] 方法参数
 */
export function wait(name:string, fn:Function, thisArg?:any, ...args:any[]):void
{
    var ctx:SyncContext = _cache[name];
    if(ctx == null)
    {
        _cache[name] = ctx = {operating: false, datas: []};
    }
    if(ctx.operating)
    {
        // 队列正在执行，推入缓存
        ctx.datas.push({fn: fn, thisArg: thisArg, args: args});
    }
    else
    {
        // 队列没有在执行，直接执行
        ctx.operating = true;
        fn.apply(thisArg, args);
    }
}

/**
 * 完成一步操作并唤醒后续操作
 * 
 * @export
 * @param {string} name 队列名字
 * @returns {void} 
 */
export function notify(name:string):void
{
    var ctx:SyncContext = _cache[name];
    if(ctx == null || ctx.datas.length <= 0)
    {
        // 队列执行完了，直接结束
        ctx.operating = false;
        return;
    }
    var data:SyncData = ctx.datas.shift();
    data.fn.apply(data.thisArg, data.args);
}

interface SyncData
{
    fn:Function;
    thisArg:any;
    args:any[];
}

interface SyncContext
{
    operating:boolean;
    datas:SyncData[];
}