import { GatewayModel } from '../../gateway-model/model/gateway-model';
import { GatewayType } from '../../gateway-template/model/gatewayType';

export class Gateway {
    businessEntityId: number;
    name: string;
    nodeIdentifier: string;
    gatewayModelId: number;
    gatewayModel: GatewayModel;
    dataProtocolId: number;
    authToken: string;
    isTemplate: boolean;
    nodeTemplateId: number;
    gatewayTemplateName: string;
    refNodeId: number;
    gatewayTypeId: number;
    gatewayType: GatewayType;
    description: string;
    id: number;
    created_by: number;
    gatewayModelName: string;
    gatewayTypeName: string;
    nodeTemplateName: string;
    isGatewayIdentifierProvided: boolean;
    assetTemplateId: number;
    assetTemplateName: string;
    gatewayIdentifierFlag:string;
    updated_by: number;
    select:boolean;
}