import { assetsManager } from "olympus-r/engine/assets/AssetsManager";
import IMediator from "olympus-r/engine/mediator/IMediator";
import MediatorStatus from "olympus-r/engine/mediator/MediatorStatus";
import { listenApply } from 'olympus-r/utils/ConstructUtil';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-26
 * @modify date 2017-10-26
 * 
 * 为DOM提供皮肤转换的工具集
*/
/**
 * 为中介者包装皮肤
 * 
 * @export
 * @param {IMediator} mediator 中介者
 * @param {(HTMLElement|string|string[])} skin 皮肤，可以是HTMLElement，也可以是皮肤字符串，也可以是皮肤模板地址或地址数组
 * @returns {HTMLElement} 皮肤的HTMLElement形式，可能会稍后再填充内容，如果想在皮肤加载完毕后再拿到皮肤请使用complete参数
 */
export function wrapSkin(mediator:IMediator, skin:HTMLElement|string|string[]):HTMLElement
{
    var result:HTMLElement = (skin instanceof HTMLElement ? skin : document.createElement("div"));
    // 判断中介者当前状态
    if(mediator.status < MediatorStatus.OPENING)
    {
        listenApply(mediator, "onOpen", doWrapSkin);
    }
    else
    {
        // 直接执行要执行的
        doWrapSkin();
    }
    // 同步返回皮肤
    return result;

    function doWrapSkin():void
    {
        if(skin instanceof HTMLElement)
        {
            // 拷贝引用
            doCopyRef(result, skin.innerHTML, mediator);
        }
        else
        {
            // 转换皮肤
            skin = getHTMLContent(skin);
            // 赋值皮肤内容
            result.innerHTML = skin;
            // 拷贝引用
            doCopyRef(result, skin, mediator);
        }
    }
}

/**
 * 判断是否是DOM字符串
 * 
 * @export
 * @param {string} str 字符串
 * @returns {boolean} 
 */
export function isDOMStr(str:string):boolean
{
    return str && (str.indexOf("<") >= 0 && str.indexOf(">") >= 0);
}

var reg:RegExp = /(\.htm|\.html|\.tpl)$/;
/**
 * 判断是否是DOM模板路径
 * 
 * @export
 * @param {string} path 路径字符串
 * @returns {boolean} 
 */
export function isDOMPath(path:string):boolean
{
    return path && reg.test(path);
}

/**
 * 将from中的所有拥有id属性的节点引用复制到to对象上
 * 
 * @export
 * @param {HTMLElement} from 复制源DOM节点
 * @param {*} to 复制目标对象
 */
export function copyRef(from:HTMLElement, to:any):void
{
    doCopyRef(from, from.innerHTML, to);
}

function doCopyRef(fromEle:HTMLElement, fromStr:string, to:any):void
{
    // 使用正则表达式将拥有id的节点赋值给mediator
    var reg:RegExp = /id=("([^"]+)"|'([^']+)')/g;
    var res:RegExpExecArray;
    while(res = reg.exec(fromStr))
    {
        var id:string = res[2] || res[3];
        to[id] = fromEle.querySelector("#" + id);
    }
}

/**
 * 转换皮肤为HTMLElement
 * 
 * @export
 * @param {(HTMLElement|string|string[])} skin 皮肤
 * @returns {HTMLElement} 
 */
export function toHTMLElement(skin:HTMLElement|string|string[]):HTMLElement
{
    if(skin instanceof HTMLElement) return skin;
    var result:HTMLElement = document.createElement("div");
    result.innerHTML = getHTMLContent(skin);
    return result;
}

/**
 * 将皮肤字符串/字符串数组或皮肤路径转变为HTML内容字符串
 * 
 * @export
 * @param {(string|string[])} skin 可以是皮肤字符串、皮肤字符串数组或皮肤路径
 * @returns {string} 
 */
export function getHTMLContent(skin:string|string[]):string
{
    if(skin instanceof Array)
    {
        // 是字符串数组，拆分后皮肤化再连接起来
        return skin.map(getHTMLContent).join("");
    }
    else if(isDOMStr(skin))
    {
        // 是皮肤字符串，直接返回
        return skin;
    }
    else
    {
        // 是皮肤路径或路径短名称，获取后返回
        return assetsManager.getAssets(skin);
    }
}