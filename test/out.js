/// <reference types="olympus-r"/>
define("main", ["require", "exports", "olympus-r/engine/Engine"], function (require, exports, Engine_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log(Engine_1.engine);
});
// import { InitStep } from 'olympus-r/engine/Engine';
// import getParam from "./utils/InitParamsUtil";
// import FirstModule from "./modules/FirstModule";
// import Olympus from 'olympus-r/Olympus';
// import { environment } from 'olympus-r/engine/env/Environment';
// import DOMBridge from "olympus-r-dom/DOMBridge";
// import EgretBridge from "olympus-r-egret/EgretBridge";
// /**
//  * @author Raykid
//  * @email initial_r@qq.com
//  * @create date 2017-08-31
//  * @modify date 2017-09-01
//  * 
//  * 测试项目
// */
// Olympus.startup({
//     bridges: [
//         new DOMBridge({
//             container: "#rootDOM"
//         }),
//         new EgretBridge({
//             width: 720,
//             height: 1280,
//             pathPrefix: "egret/",
//             container: "#rootEgret",
//             backgroundColor: 0,
//             // scaleMode: egret.StageScaleMode.SHOW_ALL
//         })
//     ],
//     firstModule: FirstModule,
//     loadElement: "#loading",
//     hostsDict: {
//         dev: ["http://www.test.17zuoye.net/"],
//         test: ["https://www.test.17zuoye.net/"],
//         staging: ["https://www.staging.17zuoye.net/"],
//         prod: ["https://www.17zuoye.com/"]
//     },
//     cdnsDict: {
//         test: ["https://cdn-cnc.test.17zuoye.net/"],
//         staging: ["https://cdn-cnc.staging.17zuoye.net/"],
//         prod: ["https://cdn-cnc.17zuoye.com/"]
//     },
//     pathDict: {
//         a: "test1.js",
//         b: "test2.js"
//     },
//     preloads: ["a", "b"],
//     onInited: function():void
//     {
//         // bridgeManager.getBridge("Egret").defaultScenePolicy = none;
//         console.log(environment.env, environment.getHost(), environment.curCDNHost);
//     },
//     onInitProgress: (prg:number, step:InitStep, ...args)=>{
//         console.log(prg, step, ...args);
//     }
// }); 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxrQ0FBa0M7Ozs7SUFJbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFNLENBQUMsQ0FBQzs7QUFHcEIsc0RBQXNEO0FBQ3RELGlEQUFpRDtBQUNqRCxtREFBbUQ7QUFFbkQsMkNBQTJDO0FBQzNDLGtFQUFrRTtBQUNsRSxtREFBbUQ7QUFDbkQseURBQXlEO0FBRXpELE1BQU07QUFDTixvQkFBb0I7QUFDcEIsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsTUFBTTtBQUNOLFVBQVU7QUFDVixLQUFLO0FBQ0wsb0JBQW9CO0FBQ3BCLGlCQUFpQjtBQUNqQiwwQkFBMEI7QUFDMUIsb0NBQW9DO0FBQ3BDLGNBQWM7QUFDZCw0QkFBNEI7QUFDNUIsMEJBQTBCO0FBQzFCLDRCQUE0QjtBQUM1QixvQ0FBb0M7QUFDcEMsdUNBQXVDO0FBQ3ZDLGtDQUFrQztBQUNsQywwREFBMEQ7QUFDMUQsYUFBYTtBQUNiLFNBQVM7QUFDVCxnQ0FBZ0M7QUFDaEMsK0JBQStCO0FBQy9CLG1CQUFtQjtBQUNuQixpREFBaUQ7QUFDakQsbURBQW1EO0FBQ25ELHlEQUF5RDtBQUN6RCw2Q0FBNkM7QUFDN0MsU0FBUztBQUNULGtCQUFrQjtBQUNsQix1REFBdUQ7QUFDdkQsNkRBQTZEO0FBQzdELGlEQUFpRDtBQUNqRCxTQUFTO0FBQ1Qsa0JBQWtCO0FBQ2xCLHlCQUF5QjtBQUN6Qix3QkFBd0I7QUFDeEIsU0FBUztBQUNULDRCQUE0QjtBQUM1QixnQ0FBZ0M7QUFDaEMsUUFBUTtBQUNSLHlFQUF5RTtBQUN6RSx1RkFBdUY7QUFDdkYsU0FBUztBQUNULDhEQUE4RDtBQUM5RCwyQ0FBMkM7QUFDM0MsUUFBUTtBQUNSLE1BQU0ifQ==