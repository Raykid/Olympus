import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { BindOn, BindValue } from "olympus-r/engine/injector/Injector";
import Mediator from "olympus-r/engine/mediator/Mediator";
import { moduleManager } from "olympus-r/engine/module/ModuleManager";
import TestPanel from "./TestPanel";

@DOMMediatorClass("TestForMediator", "<div>这是替换后的渲染器外层<div id='asdf'></div></div>")
export default class TestForMediator extends Mediator
{
    @BindOn("click", "onClickText")
    public skin:any;

    @BindValue({innerHTML: "'这是替换后的渲染器内层 - ' + data.fuck + '<br/>'"})
    public asdf:HTMLElement;

    public constructor(skin)
    {
        super(skin);
    }

    public onOpen(data):void
    {
        this.viewModel = {
            data: data,
            onClickText: ()=>{
                moduleManager.open(TestPanel);
            }
        }
        console.log("asdfasdf - " + data);
    }
}