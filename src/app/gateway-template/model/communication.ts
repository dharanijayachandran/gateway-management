import { CommProtocol } from './commprotocol';
import { GatewayCommProtocolParamValue } from './gatewayCommProtocolParamValue';
import { GatewayTemplate } from './gatewayTemplate';
import { ErrorCheckAlgorithm } from './errorCheckAlgorithm';
import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayCommProtocolIOTag } from './gatewayCommIOTags';
import { GatewayIODataHandler } from './gatewayIODataHandler';
import { CommProtocolParam } from './commProtocolParam';

export class GatewayCommProtocol {
    nodeId: number;
    gateway: GatewayTemplate;
    commProtocolId: number;
    dataFormatId: number;
    tagSeparator: string
    startValidator: string;
    endValidator: string;
    dataFormat: DataProtocolFormat;
    errorCheckAlgorithmId: string;
    id: number;
    name: string;
    status: string;
    updatedBy: number;
    updatedOn: Date;
    createdBy: number;
    createdOn: Date;
    errorCheckAlgorithm: ErrorCheckAlgorithm;
    commProtocol: CommProtocol;
    gatewayCommProtocolParamValues: GatewayCommProtocolParamValue[];
    nodeIoDhs: GatewayIODataHandler[];
    nodeCommProtocolIoTags: GatewayCommProtocolIOTag[];
    errorCheckTypeId: string;
    commParams:CommProtocolParam[];
    isEndValidatorCheckEnabled: boolean;
    isStartValidatorCheckEnabled: boolean;
    isErrorCheckEnabled: boolean;
    isLengthCheckEnabled: boolean;
}