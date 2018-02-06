import Command from "olympus-r/core/command/Command";
import CommonMessage from "olympus-r/core/message/CommonMessage";
import IScene from "olympus-r/engine/scene/IScene";
import EgretBridge from "../../EgretBridge";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-05
 * @modify date 2018-02-05
 * 
 * 这个命令是为了修复egret在display==none时获取自身尺寸是空尺寸的bug
*/
export default class UpdateScreenSizeCommand extends Command
{
    public exec():void
    {
        var params:any[] = (this.msg as CommonMessage).params;
        var to:IScene = params[0];
        var from:IScene = params[1];
        if(to && to.bridge.type === EgretBridge.TYPE && from && from.bridge.type !== EgretBridge.TYPE)
        {
            // 是从其他类型场景跳转回来的，为了防止在其他场景触发过resize导致egret尺寸失效，更新一次屏幕尺寸
            egret.updateAllScreens();
        }
    }
}