/**
 * 中间件接口
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @interface IMiddleware
 * @template T 上下文类型
 * @template P 中间件返回值类型
 */
export interface IMiddleware<T = any, P = any> {
    (context?: T, next?: () => Promise<P>): P | Promise<P>;
}
/**
 * 执行中间件流程
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @param {T} [context] 上下文对象
 * @returns {Promise<P>}
 */
export declare function runMiddlewares<T = any, P = any>(middlewares: IMiddleware<T, P>[], context?: T, outNext?: () => Promise<P>): Promise<P>;
/**
 * 合并包装一个中间件执行方法
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>} 中间件执行方法，只需传入上下文对象即可
 */
export declare function combineMiddlewares<T = any, P = any>(middlewares: IMiddleware<T, P>[]): IMiddleware<T, P>;
/**
 * 将所有中间件打平
 *
 * @author Raykid
 * @date 2019-06-18
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>[]}
 */
export declare function flattenMiddlewares<T = any, P = any>(middlewares: IMiddleware<T, P>[]): IMiddleware<T, P>[];
/**
 * 将所有中间件打平并合并成一个中间件执行器
 *
 * @author Raykid
 * @date 2019-06-18
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>}
 */
export declare function flattenCombineMiddlewares<T = any, P = any>(middlewares: IMiddleware<T, P>[]): IMiddleware<T, P>;
