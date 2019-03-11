export enum JSLoadMode
{
    AUTO,
    JSONP,
    TAG
}

export interface JSFileData
{
    url:string;
    mode?:JSLoadMode;
}

type JSFile = string | JSFileData;

export default JSFile;