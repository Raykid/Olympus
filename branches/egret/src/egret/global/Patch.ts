import { system } from "olympus-r/engine/system/System";
import { cloneObject } from "olympus-r/utils/ObjectUtil";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-07-17
 * @modify date 2018-07-17
 * 
 * 为Egret某些bug打补丁
*/
const delay:number = 130;
const oriDesc:PropertyDescriptor = Object.getOwnPropertyDescriptor(egret.TextField.prototype, "text");
const tempDesc:PropertyDescriptor = cloneObject(oriDesc);
tempDesc.set = function(value:string):void
{
    // 如果是第一次设置一个非空值，则延迟更新尺寸，因为在某些手机上可能会出现乱码
    if(!this.__egret_TextField_text_bug_patched__ && value)
    {
        this.__egret_TextField_text_bug_patched__ = true;
        // 延迟刷新
        system.setTimeout(delay, ()=>{
            this.invalidateSize();
        });
    }
    // 调用原始设置方法
    oriDesc.set.call(this, value);
};
// 篡改属性
Object.defineProperty(egret.TextField.prototype, "text", tempDesc);