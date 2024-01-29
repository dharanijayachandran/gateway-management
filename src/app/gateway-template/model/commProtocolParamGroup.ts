import { CommProtocolParam } from './commProtocolParam';
import { CommProtocol } from './commprotocol';

export class CommProtocolParamGroup {
    id: number;
    commProtocolId: number;
    commProtocolParamLevel: string;
    name: string;
    description: string;
    displayOrder: number;
    status: string;
    commProtocolParams: CommProtocolParam[];
    commProtocol: CommProtocol;
}