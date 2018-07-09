import DataType from "./DataType";
export declare function packArray(arr: any[]): any[];
export declare function parseArray(arr: any[], cls?: DataTypeClass): any[];
export declare function packMap(map: {
    [key: string]: any;
}): {
    [key: string]: any;
};
export declare function parseMap(map: {
    [key: string]: any;
}, cls?: DataTypeClass): {
    [key: string]: any;
};
export interface DataTypeClass {
    new (): DataType;
}
