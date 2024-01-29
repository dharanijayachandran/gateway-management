export class GatewayModelPort {
  id: number;
  gatewayModelId: number;
  name: string;
  description: string;
  portTypeId: number;
  internalMap: string;
  status: string;
  pins: Array<any>;
  updatedBy: number;
  updatedOn: Date;
  createdBy: number;
  createdOn: Date;
  isMappedOverPin: boolean
  nodeModelPinId:number;
  pinNames: any[];
}