import ComponentStatus from 'olympus-r/kernel/enums/ComponentStatus';
import { assetsManager } from 'olympus-r/project/assets/AssetsManager';
import { listenApply } from 'olympus-r/utils/ConstructUtil';
import { doCopyRef, isDOMStr } from './SkinUtil';
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
export function wrapSkin(mediator, skin) {
    var result = (skin instanceof HTMLElement ? skin : document.createElement("div"));
    // 判断中介者当前状态
    if (mediator.status < ComponentStatus.OPENING) {
        listenApply(mediator, "onOpen", doWrapSkin);
    }
    else {
        // 直接执行要执行的
        doWrapSkin();
    }
    // 同步返回皮肤
    return result;
    function doWrapSkin() {
        if (skin instanceof HTMLElement) {
            // 拷贝引用
            doCopyRef(result, skin.innerHTML, mediator);
        }
        else {
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
 * 转换皮肤为HTMLElement
 *
 * @export
 * @param {(HTMLElement|string|string[])} skin 皮肤
 * @returns {HTMLElement}
 */
export function toHTMLElement(skin) {
    if (skin instanceof HTMLElement)
        return skin;
    var result = document.createElement("div");
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
export function getHTMLContent(skin) {
    if (skin instanceof Array) {
        // 是字符串数组，拆分后皮肤化再连接起来
        return skin.map(getHTMLContent).join("");
    }
    else if (isDOMStr(skin)) {
        // 是皮肤字符串，直接返回
        return skin;
    }
    else {
        // 是皮肤路径或路径短名称，获取后返回
        return assetsManager.getAssets(skin);
    }
}
