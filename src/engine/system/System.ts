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
            }, 1000/60);
        }

        function onRequestAnimationFrame(timer:number):void
        {
            // 赋值timer，这个方法里无法获取this，因此需要通过注入的静态属性取到自身实例
            self._timer = timer;
            // 计划下一次执行
            requestAnimationFrame(onRequestAnimationFrame);
        }
    }
}