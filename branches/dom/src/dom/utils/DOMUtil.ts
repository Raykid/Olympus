import Dictionary from 'olympus-r/utils/Dictionary';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-09-04
 * @modify date 2018-09-04
 * 
 * DOM工具集
*/
/**
 * 获取某个节点在另一节点坐标系中的范围
 *
 * @export
 * @param {HTMLElement} target 目标节点
 * @param {HTMLElement} parent 父容器节点
 * @returns {ClientRect}
 */
export function getBoundingClientRect(target:HTMLElement, parent:HTMLElement):ClientRect
{
    const rectTarget:ClientRect = target.getBoundingClientRect();
    const rectParent:ClientRect = parent.getBoundingClientRect();
    return {
        left: rectTarget.left - rectParent.left,
        right: rectTarget.right - rectParent.left,
        top: rectTarget.top - rectParent.top,
        bottom: rectTarget.bottom - rectParent.top,
        get width():number
        {
            return this.right - this.left;
        },
        get height():number
        {
            return this.bottom - this.top;
        }
    };
}

const iframeResizeDict:Dictionary<HTMLElement, [HTMLIFrameElement, Window, (evt:Event)=>void]> = new Dictionary();

/**
 * 监听Resize
 *
 * @export
 * @param {HTMLElement} target 要监听的对象
 * @param {(target:HTMLElement)=>void} callback Resize回调
 */
export function listenResize(target:HTMLElement, callback:(target:HTMLElement)=>void):void
{
    unlistenResize(target);
    let lastWidth:number = target.offsetWidth;
    let lastHeight:number = target.offsetHeight;
    // 生成iframe
    const iframe:HTMLIFrameElement = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.visibility = "hidden";
    iframe.style.border = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    target.insertBefore(iframe, target.children.item(0));
    // 监听iframe的resize事件
    if(iframe.contentWindow)
        listenIframeResize();
    else
        iframe.addEventListener("load", listenIframeResize);

    function listenIframeResize():void
    {
        // 移除监听
        iframe.removeEventListener("load", listenIframeResize);
        // 监听resize
        iframe.contentWindow.addEventListener("resize", tryResize);
        // 记录监听
        iframeResizeDict.set(target, [iframe, iframe.contentWindow, tryResize]);
        // 尝试触发一次
        tryResize();
    }

    function tryResize():void
    {
        const curWidth:number = target.offsetWidth;
        const curHeight:number = target.offsetHeight;
        if(curWidth !== lastWidth || curHeight !== lastHeight)
        {
            lastWidth = curWidth;
            lastHeight = curHeight;
            callback(target);
        }
    }
}

/**
 * 移除Resize监听
 *
 * @export
 * @param {HTMLElement} target 要移除监听的目标节点
 */
export function unlistenResize(target:HTMLElement):void
{
    const info:[HTMLIFrameElement, Window, (evt:Event)=>void] = iframeResizeDict.get(target);
    if(info)
    {
        // 移除事件
        info[1].removeEventListener("resize", info[2]);
        // 移除显示
        info[0].remove();
        // 移除记录
        iframeResizeDict.delete(target);
    }
}

function isMesurable(target:HTMLElement):boolean
{
    return target.offsetWidth * target.offsetHeight > 0;
}

/**
 * 当目标拥有尺寸时触发Promise
 *
 * @export
 * @param {HTMLElement} target 要丈量的目标节点
 * @returns {Promise<HTMLElement>}
 */
export function waitMeasurable(target:HTMLElement):Promise<HTMLElement>
{
    return new Promise<HTMLElement>((resolve:(target:HTMLElement)=>void)=>{
        if(isMesurable(target))
        {
            resolve(target);
        }
        else
        {
            listenResize(target, ()=>{
                if(isMesurable(target))
                {
                    unlistenResize(target);
                    resolve(target);
                }
            });
        }
    });
}