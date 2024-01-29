import { GatewayModel } from '../../gateway-model/model/gateway-model';
import { GatewayCommProtocol } from './gatewayCommProtocol';
import { DataProtocol } from './dataProtocol';
import { GatewayType } from './gatewayType';

export class GatewayTemplate {

    id: any;
    businessEntityId: number;
    name: string;
    created_by: string;
    createdOn: any;
    updated_by: number;
    gatewayModelId: string
    gatewayTypeId: number;
    timeZoneId: string;
    dataProtocolId: string;
    gatewayModel: GatewayModel;
    dataProtocol: DataProtocol;
    gatewayCommProtocols: GatewayCommProtocol[];
    gatewayType: GatewayType;
    status: string;
}