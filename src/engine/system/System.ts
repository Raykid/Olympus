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
        try
        {
            requestAnimationFrame(onRequestAnimationFrame);
        }
        catch(err)
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
     * @memberof System
     */
    public nextFrame(handler:Function, thisArg?:any, ...args:any[]):void
    {
        this._nextFrameList.push([handler, thisArg, args]);
    }
}