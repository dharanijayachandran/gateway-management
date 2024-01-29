import { ErrorChecktype } from './errorCheckType';

export class ErrorCheckAlgorithm{
    id:number;
    name:string;
    status:string;
    updatedBy:number;
    updatedOn:Date;
    createdBy:number;
    createdOn: Date;
    errorCheckTypeId:number;
    errorCheckType:ErrorChecktype;
}