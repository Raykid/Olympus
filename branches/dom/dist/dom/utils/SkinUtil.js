import { assetsManager } from "olympus-r/engine/assets/AssetsManager";
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
    var result;
    if (skin instanceof HTMLElement) {
        result = skin;
    }
    else {
        // 生成一个临时的div
        result = document.createElement("div");
        // 篡改mediator的onOpen方法，先于onOpen将皮肤附上去
        var oriFunc = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
        mediator.onOpen = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (skin instanceof Array) {
                // 是数组，将所有内容连接起来再一起赋值
                skin = skin.map(getContent).join("");
            }
            // 赋值皮肤内容
            result.innerHTML = skin;
            // 拷贝引用
            doCopyRef(result, skin, mediator);
            // 恢复原始方法
            if (oriFunc)
                mediator.onOpen = oriFunc;
            else
                delete mediator.onOpen;
            // 调用原始方法
            mediator.onOpen.apply(this, args);
        };
    }
    // 赋值皮肤
    mediator.skin = result;
    // 同步返回皮肤
    return result;
}
/**
 * 将from中的所有拥有id属性的节点引用复制到to对象上
 *
 * @export
 * @param {HTMLElement} from 复制源DOM节点
 * @param {*} to 复制目标对象
 */
export function copyRef(from, to) {
    doCopyRef(from, from.innerHTML, to);
}
function doCopyRef(fromEle, fromStr, to) {
    // 使用正则表达式将拥有id的节点赋值给mediator
    var reg = /id=("([^"]+)"|'([^']+)')/g;
    var res;
    while (res = reg.exec(fromStr)) {
        var id = res[2] || res[3];
        to[id] = fromEle.querySelector("#" + id);
    }
}
function getContent(skin) {
    if (skin.indexOf("<") >= 0 && skin.indexOf(">") >= 0) {
        // 是皮肤字符串，直接返回
        return skin;
    }
    else {
        // 是皮肤路径或路径短名称，获取后返回
        return assetsManager.getAssets(skin);
    }
}
