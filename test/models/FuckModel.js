var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Inject } from 'olympus-r/core/injector/Injector';
import Hash from 'olympus-r/engine/env/Hash';
import { ModelClass } from 'olympus-r/engine/injector/Injector';
var IFuckModel = /** @class */ (function () {
    function IFuckModel() {
    }
    Object.defineProperty(IFuckModel.prototype, "fuck", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return IFuckModel;
}());
export { IFuckModel };
var FuckModel = /** @class */ (function () {
    function FuckModel() {
        this._fuck = "Fuck";
        this.shit = "Shit";
        console.log("Fuck Model Constructed!");
    }
    Object.defineProperty(FuckModel.prototype, "fuck", {
        get: function () {
            return this._fuck;
        },
        set: function (value) {
            this._fuck = value;
        },
        enumerable: true,
        configurable: true
    });
    FuckModel.prototype.fuckYou = function () {
        return "Oye!";
    };
    __decorate([
        Inject,
        __metadata("design:type", Hash)
    ], FuckModel.prototype, "hash", void 0);
    FuckModel = __decorate([
        ModelClass,
        __metadata("design:paramtypes", [])
    ], FuckModel);
    return FuckModel;
}());
export default FuckModel;
//# sourceMappingURL=FuckModel.js.map