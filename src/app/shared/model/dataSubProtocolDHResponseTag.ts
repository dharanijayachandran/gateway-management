import { DataProtocolFormat } from 'src/app/gateway-template/model/DataProtocolFormat';
import { DataProtocolTag } from './dataProtocolTag';
// import { DataProtocolFormat } from '../../gateway-template/model/DataProtocolFormat';
import { DataSubProtocolDH } from './dataSubProtocolDH';

export class DataSubProtocolDHResponseTag{
    
    id: number;
	dataSubProtocolDHId: number;
	dataSubProtocolDHName:String;
	tagIndex: number;
	tagLength: number;
	tagLengthUnit: string;
	tagLengthUnitName: string;
	tagKeyName: string;
	dataSubProtocolDHResponseTagFormatId: number;
	dataFormateName: string
	dataProtocolTagSeparator: string;
	dataProtocolTagId: number;
	dataProtocolTagName; string
	parentDataSubProtocolDHResponseTagId: number;
	parentNodeIoDHTag: string;
	isParticipantInLength: boolean;
    isParticipantInErrorCheck: boolean;
	status: string;
	updatedBy: number;
	updated_on: Date;
	createdBy: number;
	created_on: Date;
	dataProtocolTag: DataProtocolTag;
	dataSubProtocolDHResponseTagFormat: DataProtocolFormat;
	//nodeIoTag: GatewayIOTag;
    dataSubProtocolDH: DataSubProtocolDH;
    dataSubProtocolDHResponseTags: DataSubProtocolDHResponseTag[];
    dataSubProtocolDHResponseTag: DataSubProtocolDHResponseTag;
	isAssign :Boolean;
	defaultValue:string;
	
}