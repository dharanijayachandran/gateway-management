import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GatewayIOTag } from '../../model/gatewayIOTag';
import { DataProtocolFormat } from '../../model/DataProtocolFormat';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { TagLengthUnit } from '../../model/tagLengthUnit';

@Injectable({
  providedIn: 'root'
})
export class GatewayIoDhTagService {

  constructor(private httpClient: HttpClient) { }

  apiurl = environment.baseUrl_gatewayManagement;

  getGatewayIOTagsByTemplateId(templateId,tagIOMode){
    return this.httpClient.get<GatewayIOTag[]>(this.apiurl + 'gatewayIOTagsByGatewayIdandtagIOMode/' + templateId+ "/"+ tagIOMode);
  }

  getDataFormats() {
    return this.httpClient.get<DataProtocolFormat[]>(this.apiurl + 'dataProtocolFormats');
  }

  getGatewayIODHByIODHId(ioDhId){
    return this.httpClient.get<GatewayIODataHandler>(this.apiurl + 'gatewayIODHAndChildsById/' + ioDhId);
  }

  saveGatewayIODH(gatewayIODH: GatewayIODataHandler){
    return this.httpClient.post<GatewayIODataHandler>(this.apiurl + 'gatewayIODHTags',gatewayIODH);
  }

  getTagLengthUnits(){
    return this.httpClient.get<TagLengthUnit[]>(this.apiurl + 'tagLengthUnits');
  }
}
