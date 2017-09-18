/// <reference path="../dist/Olympus.d.ts"/>
/// <reference path="../dist/DOM.d.ts"/>

import startup from "Olympus";
import DOMBridge from "branches/dom/Bridge";
import FirstModule from "./modules/FirstModule";


/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * 测试项目
*/
startup(FirstModule, new DOMBridge("rootDOM"));