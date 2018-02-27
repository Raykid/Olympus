import { BindOn } from "olympus-r/engine/injector/Injector";
import PanelMediator from "olympus-r/engine/panel/PanelMediator";
import { DOMMediatorClass } from "olympus-r-dom/dom/injector/Injector";
import { moduleManager } from "olympus-r/engine/module/ModuleManager";

@DOMMediatorClass("TestPanel", `
    <div style="background:#ffffff; width:400px; height: 250px;">
        jlk124kl1j2
    </div>
`)
export default class TestPanel extends PanelMediator
{
    public static moduleName:string = "TestPanel";

    @BindOn("click", "onClick")
    public skin:HTMLElement;

    public onOpen():void
    {
        this.viewModel = {
            onClick: ()=>{
                moduleManager.close(TestPanel);
            }
        };
    }
}