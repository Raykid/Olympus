import { ModelClass } from "../../src/trunk/engine/injector/Injector";
import { Inject } from "../../src/trunk/core/injector/Injector";
import Hash from "../../src/trunk/engine/env/Hash";

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