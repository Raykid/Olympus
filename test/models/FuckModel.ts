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
export default class FuckModel extends IFuckModel
{
    @Inject
    private hash:Hash;

    public constructor()
    {
        super();
        console.log("Fuck Model Constructed!");
    }

    public get fuck():string
    {
        return "Fuck you";
    }
}