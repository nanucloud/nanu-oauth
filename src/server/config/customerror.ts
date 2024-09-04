import { Request, Response } from 'express';
export default class CustomErrorResponse  {
    static response(code:number,message:string,res:Response) {
        res.status(code).json({
            error:message
        })
    }
}