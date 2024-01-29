import { GatewayIOTag } from './gatewayIOTag';
import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayIODataHandler } from './gatewayIODataHandler';

export class GatewayIODHResponseTag{
    
    id: number;
	nodeIoDhId: number;
	nodeIODHName:string;
	tagIndex: number;
	tagLength: number;
	tagLengthUnit: string;
	tagLengthUnitName: string;
	tagKeyName: string;
	gatewayIODHResponseTagFormatId: number;
	dataFormateName: string
	tagSeparator: string;
	nodeIoTagId: number;
	nodeIOTagName: string;
	parentGatewayIODHResponseTagId: number;
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
	gatewayIODh: GatewayIODataHandler;
	isAssign :Boolean;
	parentTagName: string;
	tagName: string;
	defaultValue:string;
	gatewayIODHResponseTagName: string;
	nodeIoTag:GatewayIOTag;
}