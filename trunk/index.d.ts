/// <reference path="./kernel/global/IConstructor.d.ts"/>

/*********************** 下面是精简版引用 ***********************/

import * as Bind from "./kernel/bind/Bind";
import * as Dep from "./kernel/bind/Dep";
import * as Mutator from "./kernel/bind/Mutator";
import * as Utils from "./kernel/bind/Utils";
import * as Watcher from "./kernel/bind/Watcher";

import * as BridgeUtil from "./kernel/bridge/BridgeUtil";

import * as ComponentStatus from "./kernel/enums/ComponentStatus";

import * as Patch from "./kernel/global/Patch";

import * as BindUtil from "./kernel/injector/BindUtil";
import * as Injector from "./kernel/injector/Injector";

import * as IBridge from "./kernel/interfaces/IBridge";
import * as IComponent from "./kernel/interfaces/IComponent";
import * as IComponentConstructor from "./kernel/interfaces/IComponentConstructor";
import * as IDisposable from "./kernel/interfaces/IDisposable";
import * as IHasBridge from "./kernel/interfaces/IHasBridge";
import * as IMessage from "./kernel/interfaces/IMessage";
import * as IObservable from "./kernel/interfaces/IObservable";
import * as IOpenClose from "./kernel/interfaces/IOpenClose";

import * as ComponentMessageType from "./kernel/messages/ComponentMessageType";
import * as CoreMessageType from "./kernel/messages/CoreMessageType";

import * as CommonMessage from "./kernel/observable/CommonMessage";
import * as Message from "./kernel/observable/Message";
import * as Observable from "./kernel/observable/Observable";

import * as Component from "./kernel/Component";

/*********************** 下面是工程化引用 ***********************/

import * as AssetsManager from "./project/assets/AssetsManager";

import * as AudioContextImpl from "./project/audio/AudioContextImpl";
import * as AudioManager from "./project/audio/AudioManager";
import * as AudioMessageType from "./project/audio/AudioMessageType";
import * as AudioTagImpl from "./project/audio/AudioTagImpl";
import * as IAudio from "./project/audio/IAudio";

import * as BindUtilExt from "./project/bind/BindUtilExt";

import * as BridgeManager from "./project/bridge/BridgeManager";
import * as BridgeMessageType from "./project/bridge/BridgeMessageType";
import * as IBridgeExt from "./project/bridge/IBridgeExt";

import * as Command from "./project/core/command/Command";
import * as ICommandConstructor from "./project/core/command/ICommandConstructor";

import * as IObservableExt from "./project/core/observable/IObservableExt";
import * as ObservableExt from "./project/core/observable/ObservableExt";

import * as Core from "./project/core/Core";

import * as Environment from "./project/env/Environment";
import * as Explorer from "./project/env/Explorer";
import * as Hash from "./project/env/Hash";
import * as IShell from "./project/env/IShell";
import * as Query from "./project/env/Query";
import * as Shell from "./project/env/Shell";
import * as WindowExternal from "./project/env/WindowExternal";

import * as BindUtilExt from "./project/injector/BindUtilExt";
import * as InjectorExt from "./project/injector/InjectorExt";

import * as IConstructor from "./project/interfaces/IConstructor";
import * as IMediatorConstructor from "./project/interfaces/IMediatorConstructor";

import * as IMaskData from "./project/mask/IMaskData";
import * as MaskManager from "./project/mask/MaskManager";

import * as ForMediator from "./project/mediator/ForMediator";
import * as IMediator from "./project/mediator/IMediator";
import * as IMediatorBasicPart from "./project/mediator/IMediatorBasicPart";
import * as IMediatorModulePart from "./project/mediator/IMediatorModulePart";
import * as Mediator from "./project/mediator/Mediator";

import * as EngineMessageType from "./project/message/EngineMessageType";

import * as Model from "./project/message/Model";

import * as ModuleManager from "./project/message/ModuleManager";
import * as ModuleMessageType from "./project/message/ModuleMessageType";

import * as HTTPRequestPolicy from "./project/net/policies/HTTPRequestPolicy";

import * as DataType from "./project/net/DataType";
import * as IRequestPolicy from "./project/net/IRequestPolicy";
import * as NetManager from "./project/net/NetManager";
import * as NetMessage from "./project/net/NetMessage";
import * as NetUtil from "./project/net/NetUtil";
import * as RequestData from "./project/net/RequestData";
import * as ResponseData from "./project/net/ResponseData";

import * as IPanel from "./project/panel/IPanel";
import * as IPanelPolicy from "./project/panel/IPanelPolicy";
import * as IPromptPanel from "./project/panel/IPromptPanel";
import * as NonePanelPolicy from "./project/panel/NonePanelPolicy";
import * as PanelManager from "./project/panel/PanelManager";
import * as PanelMediator from "./project/panel/PanelMediator";
import * as PanelMessageType from "./project/panel/PanelMessageType";

import * as IPlatform from "./project/platform/IPlatform";
import * as PlatformManager from "./project/platform/PlatformManager";
import * as WebPlatform from "./project/platform/WebPlatform";

import * as IPlugin from "./project/plugin/IPlugin";

import * as IScene from "./project/scene/IScene";
import * as IScenePolicy from "./project/scene/IScenePolicy";
import * as NoneScenePolicy from "./project/scene/NoneScenePolicy";
import * as SceneManager from "./project/scene/SceneManager";
import * as SceneMediator from "./project/scene/SceneMediator";
import * as SceneMessageType from "./project/scene/SceneMessageType";

import * as Version from "./project/version/Version";

import * as Engine from "./project/Engine";
import * as Olympus from "./project/Olympus";

/*********************** 下面是工具库引用 ***********************/

import * as ArrayUtil from "./utils/ArrayUtil";
import * as ConstructUtil from "./utils/ConstructUtil";
import * as CookieUtil from "./utils/CookieUtil";
import * as Dictionary from "./utils/Dictionary";
import * as DisplayUtil from "./utils/DisplayUtil";
import * as HTMLUtil from "./utils/HTMLUtil";
import * as HTTPUtil from "./utils/HTTPUtil";
import * as ObjectUtil from "./utils/ObjectUtil";
import * as SyncUtil from "./utils/SyncUtil";
import * as System from "./utils/System";
import * as URLUtil from "./utils/URLUtil";