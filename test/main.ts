/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>
/// <reference path="../dist/Egret.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>

import DOMBridge from "branches/dom/Bridge";
import EgretBridge from "branches/egret/Bridge";
import FirstModule from "./modules/FirstModule";
import Olympus from "Olympus";
import { core } from "core/Core";
import { hash } from "engine/env/Hash";


/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * 测试项目
*/
Olympus.startup({
    bridges: [
        new DOMBridge("rootDOM"),
        new EgretBridge({
            width: 720,
            height: 1280,
            pathPrefix: "egret/",
            container: "rootEgret",
            backgroundColor: 0,
            scaleMode: egret.StageScaleMode.SHOW_ALL
        })
    ],
    firstModule: FirstModule,
    loadElement: "loading"
});