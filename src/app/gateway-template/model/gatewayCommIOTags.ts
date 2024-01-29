import { GatewayIOTag } from './gatewayIOTag';
import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayCommProtocol } from './communication';

export class GatewayCommProtocolIOTag {
	id: number;
	nodeCommProtocolId: number;
	tagIndex: string;
	tagLength: string;
	tagLengthUnit: string;
	tagKeyName: string;
	dataFormatId: string;
	tagSeprator: string;
	parentIOTagId: number;
	nodeIoTagId: number;
	parentNodeCommProtocolIoTagId: string;
	gatewayCommProtocol: GatewayCommProtocol;
	status: string;
	updated_by: number;
	updated_on: Date;
	created_by: number;
	created_on: Date;
	gatewayIOTag: GatewayIOTag;
	dataFormat: DataProtocolFormat;
	gatewayCommProtocolIOTags: GatewayCommProtocolIOTag[];
	dateTimeFormat:string;
	tagName: string;
}