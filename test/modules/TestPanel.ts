import Module from "olympus-r/engine/module/Module";
import { ModuleClass, DelegateMediator, BindOn } from "olympus-r/engine/injector/Injector";
import PanelMediator from "olympus-r/engine/panel/PanelMediator";
import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { moduleManager } from "olympus-r/engine/module/ModuleManager";

@DOMMediatorClass(`
    <div style="background:#ffffff; width:400px; height: 250px;">
        jlk124kl1j2
    </div>
`)
class TestPanelMediator extends PanelMediator
{
    @BindOn("click", "onClick")
    public skin:HTMLElement;

    public onOpen():void
    {
        this.viewModel = {
            onClick: ()=>{
                moduleManager.close(this.dependModule);
            }
        };
    }
}

@ModuleClass
export default class TestPanel extends Module
{
    @DelegateMediator
    private _mediator:TestPanelMediator;
}