/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-06-06
 * @modify date 2018-06-06
 * 
 * 用于EUI列表的流式布局策略
*/
export default class FlowLayout extends eui.BasicLayout
{
    public gapH:number;
    public gapV:number;

    public constructor(gapH:number=0, gapV:number=0)
    {
        super();
        this.gapH = gapH;
        this.gapV = gapV;
        Object.defineProperty(this, "useVirtualLayout", {
            get: function () {
                return false;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
    }

    public updateDisplayList(width:number, height:number):void
    {
        super.updateDisplayList(width, height);
        if(!this.target) return;
        let curX:number = 0;
        let curY:number = 0;
        let maxHeightInLine:number = 0;
        for(let i:number = 0, len:number = this.target.numChildren; i < len; i++)
        {
            let renderer:eui.ItemRenderer = this.target.getChildAt(i) as eui.ItemRenderer;
            // 判断是否右边超出范围，如果超出了则折行
            if(curX + renderer.width > width)
            {
                curX = 0;
                curY += maxHeightInLine + this.gapV;
            }
            // 设置横纵坐标
            renderer.x = curX;
            renderer.y = curY;
            // 记录最大高度
            if(renderer.height > maxHeightInLine)
                maxHeightInLine = renderer.height;
            // 累加横坐标
            curX += renderer.width + this.gapH;
        }
    }
}