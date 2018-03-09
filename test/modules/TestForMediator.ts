import Mediator from "olympus-r/engine/mediator/Mediator";
import { MediatorClass, BindValue, BindOn } from "olympus-r/engine/injector/Injector";
import { moduleManager } from "olympus-r/engine/module/ModuleManager";
import TestPanel from "./TestPanel";
import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";

@DOMMediatorClass("TestForMediator", "<div>这是替换后的渲染器外层<div id='asdf'></div></div>")
export default class TestForMediator extends Mediator
{
    @BindOn("click", "onClickText")
    public skin:any;

    @BindValue({textContent: "'这是替换后的渲染器内层 - ' + data + '<br/>'"})
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