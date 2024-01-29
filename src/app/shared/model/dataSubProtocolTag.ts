import { DataSubProtocolDH } from './dataSubProtocolDH';
// import { DataProtocolFormat } from '../../gateway-template/model/DataProtocolFormat';
import { DataProtocolTag } from './dataProtocolTag';
import { DataSubProtocol } from './dataSubProtocol';
import { DataProtocolFormat } from 'src/app/gateway-template/model/DataProtocolFormat';

export class DataSubProtocolTag {
    id: number;
    dataSubProtocol: DataSubProtocol;
    dataSubProtocolId: number;
    //dataProtocolTag: DataProtocolTag;
    dataProtocolTagId: number;
    dataProtocolTag: DataProtocolTag
    tagIndex: number;
    tagLength: number;
    tagLengthUnit: String;
    tagKeyName: String;
    dataProtocolTagSeparator: String;
    parentDataSubProtocolTagId: number;
    //dataSubProtocolDHTagValues: DataSubProtocolDHTagValue[];
    dataSubProtocolTags: DataSubProtocolTag[];
    dataSubProtocolTagFormat: DataProtocolFormat;
    dataSubProtocolTagFormatId: number;
    isParticipantInLength: Boolean;
    isParticipantInErrorCheck: Boolean;
    dateTimeFormat: String;
    createdBy: number;
    updatedBy: number;
    status: string;
    tagLengthUnitValue:String;
}