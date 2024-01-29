import { DataSubProtocol } from './dataSubProtocol';
// import { DataProtocolFormat } from '../../gateway-template/model/DataProtocolFormat';
import { DataSubProtocolDHTag } from './dataSubProtocolDHTag';
import { DataSubProtocolDHResponseTag } from './dataSubProtocolDHResponseTag';
import { DataProtocolFormat } from 'src/app/gateway-template/model/DataProtocolFormat';

export class DataSubProtocolDH {
    id: number;
    dataSubProtocol: DataSubProtocol;
    dataSubProtocolId: number;
    dhCode: String;
    name: string;
    description: String;
    operatioMode: String;
    responseTagSeperator: String;
    dataSubProtocolDHTags: DataSubProtocolDHTag[];
    dataSubProtocolDHResponseTags: DataSubProtocolDHResponseTag[];
    sendResponse: boolean;
    responseFormat: DataProtocolFormat;
    responseFormatId: number;
    status: string
    createdBy: number;
    updatedBy: number;
    dataProtocolId: number;
    dataProtocolName : string;
    communication: string;
    sendResponseStr: string;

}