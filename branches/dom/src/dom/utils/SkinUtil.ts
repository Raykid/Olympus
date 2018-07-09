/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-26
 * @modify date 2017-10-26
 * 
 * 为DOM提供皮肤转换的工具集
*/

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

export function doCopyRef(fromEle:HTMLElement, fromStr:string, to:any):void
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