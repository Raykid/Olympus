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

@ModelClass(IFuckModel)
export default class FuckModel extends IFuckModel
{
    @Inject
    private hash:Hash;

    public get fuck():string
    {
        return "Fuck you";
    }
}