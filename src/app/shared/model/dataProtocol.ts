import { DataSubProtocol } from './dataSubProtocol';
// import { GatewayCommProtocol } from '../../gateway-template/model/gatewayCommProtocol';

export class DataProtocol{
    id: number;  
    name: string;
	description: string;
	isGeneric: boolean;
	businessEntityId: number;
    status: string;
    updatedBy: number;
    createdBy: number;
    publicAccess: string;
    dataSubProtocols: DataSubProtocol[];
    commProtocols: any[];
    communications: string[];
}