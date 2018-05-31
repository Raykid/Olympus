/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-05-16
 * @modify date 2018-05-16
 * 
 * HTML相关工具
*/

/**
 * 获取当前所在的容器iframe，如果没有则返回null
 * 
 * @export
 * @returns {(HTMLIFrameElement|null)} 
 */
export function getIFrameContainer():HTMLIFrameElement|null
{
    var parentWindow:Window = window.parent;
    if(!parentWindow) return null;
    var tempIFrames:NodeListOf<HTMLIFrameElement> = parentWindow.document.getElementsByTagName("iframe");
    for(var i:number = 0, len:number = tempIFrames.length; i < len; i++)
    {
        var tempIFrame:HTMLIFrameElement = tempIFrames[i];
        // 如果寻找到的iframe中的window和当前window一致，则返回之
        if(tempIFrame.contentWindow === window)
            return tempIFrame;
    }
    return null;
}

/**
 * 获取最根节点的Window实例
 * 
 * @export
 * @returns {Window} 
 */
export function getRootWindow():Window
{
    let curWindow:Window = window;
    while(curWindow.parent)
        curWindow = curWindow.parent;
    return curWindow;
}

/**
 * 获取当前是否在iframe中
 * 
 * @export
 * @returns {boolean} 
 */
export function isInIframe():boolean
{
    return (getIFrameContainer() !== null);
}