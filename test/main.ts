/// <reference types="olympus-r"/>
/// <reference types="olympus-r-dom"/>
/// <reference types="olympus-r-egret"/>
/// <reference path="./egret/libs/modules/egret/egret.d.ts"/>
/// <reference path="./egret/libs/modules/res/res.d.ts"/>
/// <reference path="./egret/libs/modules/eui/eui.d.ts"/>
/// <reference path="./egret/libs/modules/tween/tween.d.ts"/>

import getParam from "./utils/InitParamsUtil";
import First from "./modules/First";

import Olympus from 'olympus-r/Olympus';
import { environment } from 'olympus-r/engine/env/Environment';
import { InitStep } from 'olympus-r/engine/Engine';
import DOMBridge from "olympus-r-dom/DOMBridge";
import EgretBridge from "olympus-r-egret/EgretBridge";

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
    firstModule: First,
    loadElement: "#loading",
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
        console.log(environment.env, environment.getHost(), environment.curCDNHost);
    },
    onInitProgress: (prg:number, step:InitStep, ...args)=>{
        console.log(prg, step, ...args);
    }
});