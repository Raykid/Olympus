/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 * 
 * Egret缓动工具集，用来弥补Egret的Tween的不足
*/

export function tweenTo(target:any, props:any, duration?:number, ease?:Function):egret.Tween
{
    return egret.Tween.get(target).to(props, duration, ease);
}

export function tweenFrom(target:any, props:any, duration?:number, ease?:Function):egret.Tween
{
    // 对换参数状态
    var toProps:any = {};
    for(var key in props)
    {
        toProps[key] = target[key];
        target[key] = props[key];
    }
    // 开始缓动
    return egret.Tween.get(target).to(toProps, duration, ease);
}