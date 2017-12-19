import "reflect-metadata";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 *
 * Core模组的装饰器注入模块
*/
/** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
export declare function Injectable(...args: any[]): any;
/** 赋值注入的实例 */
export declare function Inject(prototype: any, propertyKey: string): void;
export declare function Inject(cls: any): PropertyDecorator;
