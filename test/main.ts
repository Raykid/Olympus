/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>
/// <reference path="../dist/Egret.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>

import DOMBridge from "branches/dom/Bridge";
import EgretBridge from "branches/egret/Bridge";
import Olympus from "Olympus";
import { windowExternal } from "engine/env/WindowExternal";
import { query } from "engine/env/Query";
import { environment } from "engine/env/Environment";
import getParam from "./utils/InitParamsUtil"
import FirstModule from "./modules/FirstModule";

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
    loadElement: "loading",
    env: getParam("server_type"),
    hostsDict: {
        dev: ["http://www.test.17zuoye.net/"],
        test: ["https://www.test.17zuoye.net/"],
        staging: ["https://www.staging.17zuoye.net/"],
        prod: ["https://www.17zuoye.com/"]
    },
    cdnsDict: {
        dev: ["http://cdn-cnc.test.17zuoye.net"],
        test: ["https://cdn-cnc.test.17zuoye.net/"],
        staging: ["https://cdn-cnc.staging.17zuoye.net/"],
        prod: ["https://cdn-cnc.17zuoye.com/"]
    }
});

console.log(environment.env, environment.getHost(), environment.curCDNHost);