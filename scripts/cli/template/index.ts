/// <reference types="olympus-r"/>
/// <reference types="olympus-r-dom"/>
/// <reference types="olympus-r-egret"/>
/// <reference path="egret/libs/modules/egret/egret.d.ts"/>
/// <reference path="egret/libs/modules/game/game.d.ts"/>
/// <reference path="egret/libs/modules/res/res.d.ts"/>
/// <reference path="egret/libs/modules/eui/eui.d.ts"/>
/// <reference path="egret/libs/modules/tween/tween.d.ts"/>
/// <reference path="egret/libs/exml.e.d.ts"/>
/// <reference path="types.d.ts"/>

import FastClick from 'fastclick';
import DOMBridge from 'olympus-r-dom/DOMBridge';
import EgretBridge from "olympus-r-egret/EgretBridge";
import { query } from "olympus-r/engine/env/Query";
import NetMessage from "olympus-r/engine/net/NetMessage";
import Olympus, { core } from "olympus-r/Olympus";
import GetServerResponseCommand from "./src/command/GetServerResponseCommand";
import NetworkErrorCommand from "./src/command/NetworkErrorCommand";
import { DOMPrompt, EgretPrompt } from './src/component/prompt/Prompt';
import './src/global/global.scss';
import Homepage from "./src/module/Homepage/Homepage";

(async ()=>{
    // 启动Olympus
    Olympus.startup({
        bridges: [
            new DOMBridge({
                container: "#rootDOM",
                promptClass: DOMPrompt,
                maskData: {
                    loadingAlpha: 0,
                },
            }),
            new EgretBridge({
                width: 720,
                height: 1280,
                pathPrefix: "egret/",
                container: "#rootEgret",
                backgroundColor: 0xffffff,
                scaleMode: egret.StageScaleMode.FIXED_NARROW,
                renderMode: 1,
                maskData: {
                    loadingAlpha: 0
                },
                promptClass: EgretPrompt,
            }),
        ],
        firstModule: Homepage,
        loadElement: "#loading",
        env: query.getParam("env"),
        hostsDict: {
            // 这里放env对应的消息域名数组
        },
        cdnsDict: {
            // 这里放env对应的资源域名数组
        },
        plugins: [
        ],
        onInited: async ()=>{
            // 使用fastclick
            FastClick.attach(document.body);
            // 注册网络错误命令
            core.mapCommand(NetMessage.NET_ERROR, NetworkErrorCommand);
            // 注册服务器返回命令
            core.mapCommand(NetMessage.NET_RESPONSE, GetServerResponseCommand);
        }
    });
})();