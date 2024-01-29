import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayIODHTag } from './gatewayIODHTag';
import { GatewayIODHResponseTag } from './gatewayIODhResponseTag';

export class GatewayIODataHandler {
    id: number;
    name: string;
    dhCode: string;
    description: string;
    operationMode: string;
    publishIntervalMs: string
    retryCount: string
    retryTimeoutMs: string
    sendResponse: any;
    responseFormat: any;
    responseFormatId: string;
    responseTagSeperator: string;
    status: string
    createdBy: number;
    updatedBy: number;
    nodeCommProtocolId: number;
    nodeIoDhTags: GatewayIODHTag[];
    nodeIoDhResponseTags: GatewayIODHResponseTag[];
    gatewayId: number;
    templateName : string;
    communication: string;
    isEndValidatorCheckEnabled: boolean;
    isStartValidatorCheckEnabled: boolean;
    isErrorCheckEnabled: boolean;
    isLengthCheckEnabled: boolean;

}