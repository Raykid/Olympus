import Command from "olympus-r/core/command/Command";
import IPromptPanel from "olympus-r/engine/panel/IPromptPanel";
import { panelManager } from "olympus-r/engine/panel/PanelManager";
import CommonMessage from "olympus-r/core/message/CommonMessage";
import RequestData from "olympus-r/engine/net/RequestData";


export default class NetworkErrorCommand extends Command {
    public exec(): void {
        // 弹框提示
        panelManager.prompt(
            "网络异常，请检查后重试",
            { data: "稍后再试" },
            { data: "立即重试", handler: (data: any)=>{
                (this.msg as CommonMessage).params[1].redispatch();
            } },
        );
    }
}
