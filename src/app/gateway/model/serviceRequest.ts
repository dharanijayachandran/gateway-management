export class serviceRequest{
    serviceRequestNumber:number;
    organizationId:number;
    url:string;
    httpMethod:string;
    totalRecords:number;
    inValidRecords:number;
    createdOn:number;
    lastUpdatedOn:number;
    status:string;
    serviceRequestDetails:serviceRequestDetails[];
     organization :any;
}
export class serviceRequestDetails{
    serviceRequestId:number;
    organizationId:number;
    gatewayTemplateId:number;
    assetTemplateId:number;
    gatewayIdenifier:string;
    statusDescription:string;
    status:string;
}
 export interface orgValues {
    id:number;
    name:string;
 } 