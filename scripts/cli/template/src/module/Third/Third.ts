import PhaserCEBridge from 'olympus-r-phaserce/dist/PhaserCEBridge';
import { bridgeManager } from 'olympus-r/engine/bridge/BridgeManager';
import { BindFunc, BindOn, BindValue, MediatorClass } from 'olympus-r/engine/injector/Injector';
import { moduleManager } from 'olympus-r/engine/module/ModuleManager';
import SceneMediator from 'olympus-r/engine/scene/SceneMediator';
import Homepage from '../Homepage/Homepage';

@MediatorClass("Third")
export default class Third extends SceneMediator
{
    private _game:Phaser.Game;

    public skin:Phaser.Sprite;
    @BindValue({
        text: "title",
        x: "200",
        y: "300",
    })
    @BindFunc("addColor", ["'#ffffff'", "0"])
    public txt_title:Phaser.Text;
    @BindValue({
        x: "250",
        y: "800",
    })
    @BindOn("onInputDown", "onBack")
    public btn_back:Phaser.Button;
    @BindValue("text", "buttonText")
    public txt_back:Phaser.Text;

    public constructor()
    {
        super();
        // 记录Game引用
        this._game = bridgeManager.getBridge(PhaserCEBridge.TYPE).stage.game;
        // 生成皮肤
        this.skin = this._game.add.sprite();
        // 背景
        const bg:Phaser.Graphics = this._game.add.graphics();
        bg.beginFill(0x770077);
        bg.drawRect(0, 0, this._game.stage.width, this._game.stage.height);
        bg.endFill();
        this.skin.addChild(bg);
        // 文字
        this.txt_title = this._game.add.text();
        this.skin.addChild(this.txt_title);
        // 按钮
        this.btn_back = this._game.add.button();
        const btnBG:Phaser.Graphics = this._game.add.graphics();
        btnBG.beginFill(0x999999);
        btnBG.drawRect(0, 0, 150, 60);
        btnBG.endFill();
        this.btn_back.addChild(btnBG);
        this.txt_back = this._game.add.text(20, 15);
        this.txt_back.addColor("#ffffff", 0);
        this.btn_back.addChild(this.txt_back);
        this.skin.addChild(this.btn_back);
    }

    public async onOpen():Promise<void>
    {
        // 生成ViewModel
        this.viewModel = {
            status: 0,
            get title():string
            {
                switch(this.status)
                {
                    case 0:
                        return "这是Phaser CE模块";
                    case 1:
                        return "确定要返回首页吗？";
                    default:
                        return "";
                }
            },
            get buttonText():string
            {
                switch(this.status)
                {
                    case 0:
                        return "返回首页";
                    case 1:
                        return "我确定";
                    default:
                        return "";
                }
            },
            onBack: ()=>{
                switch(this.viewModel.status)
                {
                    case 0:
                        this.viewModel.status = 1;
                        break;
                    case 1:
                        // 回第一个模块
                        moduleManager.open(Homepage);
                        break;
                }
            },
        };
    }
}