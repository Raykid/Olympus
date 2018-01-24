import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 用来记录程序运行时间，并且提供延迟回调或频率回调功能
*/
@Injectable
export default class System
{
    // 这里尝试一下TS的Tuple类型——Raykid
    private _nextFrameList:[Function, any, any[]][] = [];

    private _timer:number = 0;
    /**
     * 获取从程序运行到当前所经过的毫秒数
     * 
     * @returns {number} 毫秒数
     * @memberof System
     */
    public getTimer():number
    {
        return this._timer;
    }

    public constructor()
    {
        var self:System = this;
        if(window.requestAnimationFrame instanceof Function)
        {
            requestAnimationFrame(onRequestAnimationFrame);
        }
        else
        {
            // 如果不支持requestAnimationFrame则改用setTimeout计时，延迟时间1000/60毫秒
            var startTime:number = Date.now();
            setInterval(function()
            {
                var curTime:number = Date.now();
                // 赋值timer
                self._timer = curTime - startTime;
                // 调用tick方法
                self.tick();
            }, 1000/60);
        }

        function onRequestAnimationFrame(timer:number):void
        {
            // 赋值timer，这个方法里无法获取this，因此需要通过注入的静态属性取到自身实例
            self._timer = timer;
            // 调用tick方法
            self.tick();
            // 计划下一次执行
            requestAnimationFrame(onRequestAnimationFrame);
        }
    }

    private tick():void
    {
        // 调用下一帧回调
        for(var i:number = 0, len:number = this._nextFrameList.length; i < len; i++)
        {
            var data:[Function, any, any[]] = this._nextFrameList.shift();
            data[0].apply(data[1], data[2]);
        }
    }

    /**
     * 在下一帧执行某个方法
     * 
     * @param {Function} handler 希望在下一帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public nextFrame(handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        var data:[Function, any, any[]] = [handler, thisArg, args];
        this._nextFrameList.push(data);
        return {
            cancel: ()=>{
                var index:number = this._nextFrameList.indexOf(data);
                if(index >= 0) this._nextFrameList.splice(index, 1);
            }
        };
    }

    /**
     * 每帧执行某个方法，直到取消为止
     * 
     * @param {Function} handler 每帧执行的某个方法
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 方法参数列表
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public enterFrame(handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        var self:System = this;
        var cancelable:ICancelable = this.nextFrame(wrapHandler, thisArg, ...args);

        return {
            cancel: ()=>{
                cancelable.cancel();
            }
        };

        function wrapHandler(...args:any[]):void
        {
            // 调用回调
            handler.apply(this, args);
            // 执行下一帧
            cancelable = self.nextFrame(wrapHandler, this, ...args);
        }
    }

    /**
     * 设置延迟回调
     * 
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public setTimeout(duration:number, handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        var startTimer:number = this._timer;
        // 启动计时器
        var nextFrame:ICancelable = this.nextFrame(tick, this);
        
        function tick():void
        {
            var delta:number = this._timer - startTimer;
            if(delta >= duration)
            {
                nextFrame = null;
                handler.apply(thisArg, args);
            }
            else
            {
                nextFrame = this.nextFrame(tick, this);
            }
        }

        return {
            cancel():void
            {
                nextFrame && nextFrame.cancel();
                nextFrame = null;
            }
        };
    }

    /**
     * 设置延时间隔
     * 
     * @param {number} duration 延迟毫秒值
     * @param {Function} handler 回调函数
     * @param {*} [thisArg] this指向
     * @param {...any[]} args 要传递的参数
     * @returns {ICancelable} 可取消的句柄
     * @memberof System
     */
    public setInterval(duration:number, handler:Function, thisArg?:any, ...args:any[]):ICancelable
    {
        var timeout:ICancelable = this.setTimeout(duration, onTimeout, this);

        function onTimeout():void
        {
            // 触发回调
            handler.apply(thisArg, args);
            // 继续下一次
            timeout = this.setTimeout(duration, onTimeout, this);
        }

        return {
            cancel():void
            {
                timeout && timeout.cancel();
                timeout = null;
            }
        };
    }
}

export interface ICancelable
{
    cancel():void;
}

/** 再额外导出一个单例 */
export const system:System = core.getInject(System);