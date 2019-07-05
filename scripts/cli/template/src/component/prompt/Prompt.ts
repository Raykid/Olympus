import { BindCSS, DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { EgretMediatorClass } from 'olympus-r-egret/egret/injector/Injector';
import { BindFor, BindIf, BindOn, BindValue } from "olympus-r/engine/injector/Injector";
import IPromptPanel, { IPromptParams } from "olympus-r/engine/panel/IPromptPanel";
import PanelMediator from "olympus-r/engine/panel/PanelMediator";
import skin from "./Prompt.html";
import './Prompt.scss';

@DOMMediatorClass("DOMPrompt", skin)
export class DOMPrompt extends PanelMediator<HTMLElement> implements IPromptPanel
{
    @BindIf("!params.handlers || params.handlers.length === 0")
    @BindOn("click", "$this.close()")
    public btn_close:HTMLElement;
    @BindIf("params.title != null")
    @BindValue("textContent", "params.title")
    public txt_title:HTMLElement;
    @BindValue("textContent", "params.msg")
    public txt_content:HTMLElement;
    @BindFor("handler of params.handlers")
    @BindValue("textContent", "handler.text || handler.data")
    @BindCSS({
        important: "handler.buttonType === 1",
        normal: "handler.buttonType !== 1"
    })
    @BindOn("click", `
        $this.close();
        handler.handler && handler.handler($data);
    `)
    public lst_buttons:HTMLElement;

    private _params:IPromptParams;

    public onOpen():void
    {
        this.viewModel = {
            params: this._params || {
                title: null,
                msg: null,
                handlers: []
            },
            handleButtonLeft: function(index:number):string
            {
                switch(this.params.handlers.length)
                {
                    case 0:
                        return "0%";
                    case 1:
                        return "50%";
                    default:
                        return (28 + 44 * index) + "%";
                }
            }
        };
    }

    public update(params:IPromptParams):void
    {
        this._params = params;
        if(this.viewModel)
        {
            this.viewModel.params = this._params;
        }
    }
}

@EgretMediatorClass("EgretPrompt", "skins.PromptSkin")
export class EgretPrompt extends PanelMediator implements IPromptPanel
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