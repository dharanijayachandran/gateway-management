/* import { DataProtocol } from '../../gateway-template/model/dataProtocol';
import { DataProtocolFormat } from '../../gateway-template/model/DataProtocolFormat';
import { CommProtocol } from '../../gateway-template/model/commprotocol';
import { ErrorCheckAlgorithm } from '../../gateway-template/model/errorCheckAlgorithm'; */
import { CommProtocol } from 'src/app/gateway-template/model/commprotocol';
import { DataProtocol } from 'src/app/gateway-template/model/dataProtocol';
import { DataProtocolFormat } from 'src/app/gateway-template/model/DataProtocolFormat';
import { ErrorCheckAlgorithm } from 'src/app/gateway-template/model/errorCheckAlgorithm';
import { DataSubProtocolDH } from './dataSubProtocolDH';
import { DataSubProtocolTag } from './dataSubProtocolTag';

export class DataSubProtocol {
    id: number;
    dataProtocol: DataProtocol;
    dataProtocolId: number;
    name: String;
    description: String;
    commProtocolIdentifierOne: String;
    commProtocolIdentifierTwo: String;
    commProtocolIdentifierThree: String;
    dataProtocolTagSeparator: String;
    dataSubProtocolFormat: DataProtocolFormat;
    dataSubProtocolFormatID: number;
    commProtocol: CommProtocol;
    commProtocolId: number;
    startValidator: String;
    endValidator: String;
    errorCheckAlgorithmId: number;
    errorCheckAlgorithm: ErrorCheckAlgorithm;
    dataSubProtocolDHs: DataSubProtocolDH[];
    dataSubProtocolTags: DataSubProtocolTag[];
    createdBy: number;
    updatedBy: number;
    errorCheckTypeId: number;
}