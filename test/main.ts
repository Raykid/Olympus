/// <amd-module name="main"/>
/// <reference path="../trunk/dist/Olympus.d.ts"/>
/// <reference path="../branches/dom/dist/DOM.d.ts"/>
/// <reference path="../branches/egret/dist/Egret.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>

import getParam from "./utils/InitParamsUtil";
import FirstModule from "./modules/FirstModule";
import Olympus from "Olympus";
import { environment } from "engine/env/Environment";
import DOMBridge from "DOMBridge";
import EgretBridge from "EgretBridge";
import { InitStep } from "engine/Engine";

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
        new DOMBridge({
            container: "#rootDOM"
        }),
        new EgretBridge({
            width: 720,
            height: 1280,
            pathPrefix: "egret/",
            container: "#rootEgret",
            backgroundColor: 0,
            // scaleMode: egret.StageScaleMode.SHOW_ALL
        })
    ],
    firstModule: FirstModule,
    loadElement: "#loading",
    env: getParam("server_type"),
    hostsDict: {
        dev: ["http://www.test.17zuoye.net/"],
        test: ["https://www.test.17zuoye.net/"],
        staging: ["https://www.staging.17zuoye.net/"],
        prod: ["https://www.17zuoye.com/"]
    },
    cdnsDict: {
        test: ["https://cdn-cnc.test.17zuoye.net/"],
        staging: ["https://cdn-cnc.staging.17zuoye.net/"],
        prod: ["https://cdn-cnc.17zuoye.com/"]
    },
    pathDict: {
        a: "test1.js",
        b: "test2.js"
    },
    preloads: ["a", "b"],
    onInited: function():void
    {
        // bridgeManager.getBridge("Egret").defaultScenePolicy = none;
    },
    onInitProgress: (prg:number, step:InitStep, ...args)=>{
        console.log(prg, step, ...args);
    }
});

console.log(environment.env, environment.getHost(), environment.curCDNHost);