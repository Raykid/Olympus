import { ModelClass } from "engine/injector/Injector";
import { Inject } from "core/injector/Injector";
import Hash from "engine/env/Hash";

export class IFuckModel
{
    public get fuck():string
    {
        return null;
    }
}

@ModelClass(1, IFuckModel)
export default class FuckModel
{
    @Inject
    private hash:Hash;

    private _fuck:string = "Fuck";
    public get fuck():string
    {
        return this._fuck;
    }
    public set fuck(value:string)
    {
        this._fuck = value;
    }

    public shit:string = "Shit";

    public constructor()
    {
        console.log("Fuck Model Constructed!");
    }

    public fuckYou():string
    {
        return "Oye!";
    }
}