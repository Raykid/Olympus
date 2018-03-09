import Mediator from "olympus-r/engine/mediator/Mediator";
import { MediatorClass, BindValue, BindOn } from "olympus-r/engine/injector/Injector";
import { moduleManager } from "olympus-r/engine/module/ModuleManager";
import TestPanel from "./TestPanel";

@MediatorClass("TestForMediator")
export default class TestForMediator extends Mediator
{
    @BindValue({textContent: "'这是子Mediator - ' + data + ' - 1'"})
    @BindOn("click", "onClickText")
    public skin:any;

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