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
        ModelClass(1, IFuckModel),
        __metadata("design:paramtypes", [])
    ], FuckModel);
    return FuckModel;
}());
export default FuckModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVja01vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRnVja01vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxRCxPQUFPLElBQUksTUFBTSwyQkFBMkIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFFaEU7SUFBQTtJQU1BLENBQUM7SUFKRyxzQkFBVyw0QkFBSTthQUFmO1lBRUksTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUNMLGlCQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7O0FBR0Q7SUFpQkk7UUFaUSxVQUFLLEdBQVUsTUFBTSxDQUFDO1FBVXZCLFNBQUksR0FBVSxNQUFNLENBQUM7UUFJeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFkRCxzQkFBVywyQkFBSTthQUFmO1lBRUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQzthQUNELFVBQWdCLEtBQVk7WUFFeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQzs7O09BSkE7SUFhTSwyQkFBTyxHQUFkO1FBRUksTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBdEJEO1FBREMsTUFBTTtrQ0FDTSxJQUFJOzJDQUFDO0lBSEQsU0FBUztRQUQ3QixVQUFVLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQzs7T0FDTCxTQUFTLENBMEI3QjtJQUFELGdCQUFDO0NBQUEsQUExQkQsSUEwQkM7ZUExQm9CLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QgfSBmcm9tICdvbHltcHVzLXIvY29yZS9pbmplY3Rvci9JbmplY3Rvcic7XHJcbmltcG9ydCBIYXNoIGZyb20gJ29seW1wdXMtci9lbmdpbmUvZW52L0hhc2gnO1xyXG5pbXBvcnQgeyBNb2RlbENsYXNzIH0gZnJvbSAnb2x5bXB1cy1yL2VuZ2luZS9pbmplY3Rvci9JbmplY3Rvcic7XHJcblxyXG5leHBvcnQgY2xhc3MgSUZ1Y2tNb2RlbFxyXG57XHJcbiAgICBwdWJsaWMgZ2V0IGZ1Y2soKTpzdHJpbmdcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuQE1vZGVsQ2xhc3MoMSwgSUZ1Y2tNb2RlbClcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVja01vZGVsXHJcbntcclxuICAgIEBJbmplY3RcclxuICAgIHByaXZhdGUgaGFzaDpIYXNoO1xyXG5cclxuICAgIHByaXZhdGUgX2Z1Y2s6c3RyaW5nID0gXCJGdWNrXCI7XHJcbiAgICBwdWJsaWMgZ2V0IGZ1Y2soKTpzdHJpbmdcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZnVjaztcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgZnVjayh2YWx1ZTpzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fZnVjayA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaGl0OnN0cmluZyA9IFwiU2hpdFwiO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJGdWNrIE1vZGVsIENvbnN0cnVjdGVkIVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZnVja1lvdSgpOnN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBcIk95ZSFcIjtcclxuICAgIH1cclxufSJdfQ==