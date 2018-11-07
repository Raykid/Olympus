import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";
import { BindFor, BindIf, BindOn, BindValue } from "olympus-r/engine/injector/Injector";
import IPromptPanel, { IPromptParams } from "olympus-r/engine/panel/IPromptPanel";
import PanelMediator from "olympus-r/engine/panel/PanelMediator";

@EgretMediatorClass("Prompt", "skins.PromptSkin")
export class Prompt extends PanelMediator implements IPromptPanel
{
    @BindValue("text", "title || ''")
    public txt_title:eui.Label;
    @BindValue("text", "msg || ''")
    public txt_content:eui.Label;
    @BindIf("!handlers || handlers.length === 0")
    @BindOn(egret.TouchEvent.TOUCH_TAP, "$this.close()")
    public btn_close:eui.Button;
    @BindFor("btn of handlers")
    @BindValue({
        "labelDisplay.text": "btn.text"
    })
    @BindOn(egret.TouchEvent.TOUCH_TAP, "btn.handler && btn.handler(btn.data);$this.close();")
    public lst_buttons:eui.DataGroup;

    public onOpen():void
    {
        this.viewModel = {
            // 这里列出所有被绑定的属性
            msg: null,
            title: null,
            handlers: null
        };
    }

    public update(params:IPromptParams):void
    {
        for(let key in params)
        {
            this.viewModel[key] = params[key];
        }
    }
}