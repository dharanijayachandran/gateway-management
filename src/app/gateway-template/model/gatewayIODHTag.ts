import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayIOTag } from './gatewayIOTag';
import { GatewayIODataHandler } from './gatewayIODataHandler';

export class GatewayIODHTag{
    id: number;
	nodeIoDhId: number;
	nodeIODHName:string;
	tagIndex: number;
	tagLength: number;
	tagLenthUnit: string;
	tagLenthUnitName: string;
	tagKeyName: string;
	dataFormatId: number;
	dataFormateName: string
	tagSeparator: string;
	nodeIoTagId: number;
	nodeIOTagName; string
	parentNodeIoDhTagId: number;
	parentNodeIoDHTag: string;
	isParticipantInLength: boolean;
    isParticipantInErrorCheck: boolean;
	status: string;
	updated_by: number;
	updated_on: Date;
	created_by: number;
	created_on: Date;
	gatewayIOTag: GatewayIOTag;
	dataFormat: DataProtocolFormat;
	nodeIoTag: GatewayIOTag;
	nodeIoDh: GatewayIODataHandler;
	isAssign :Boolean;
	dateTimeFormat:string;
	parentTagName: string;
	tagName: string;
	defaultValue:string;
	nodeIODHTagName: string;
}