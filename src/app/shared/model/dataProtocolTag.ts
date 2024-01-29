import { DataProtocolFormat } from 'src/app/gateway-template/model/DataProtocolFormat';
import { DataProtocol } from './dataProtocol';
// import { DataProtocolFormat } from '../../gateway-template/model/DataProtocolFormat';

export class DataProtocolTag{
   dataProtocol: DataProtocol;
   dataProtocolId: number;
    name: string;
    tagKeyName: string;
    description: string;
    tagType: string;
    tagIOMode:string;
    dataTypeId: number;
    dataTypeName: string;
    dataProtocolStandardTag: DataProtocolFormat;
    dataProtocolStandardTagId: number;
    engUnitId: number;
    id: number;
    status: string;
    updatedBy: number;
    updatedOn: Date;
    createdBy: number;
    createdOn: Date;
}