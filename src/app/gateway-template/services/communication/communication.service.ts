import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GatewayCommProtocol } from '../../model/communication';
import { CommProtocolParam } from '../../model/commProtocolParam';
import { DataProtocolFormat } from '../../model/DataProtocolFormat';
import { CommProtocolParamValue } from '../../model/commProtocolParamValue';
import { Observable } from 'rxjs/Observable';
import { ErrorChecktype } from '../../model/errorCheckType';
import { ErrorCheckAlgorithm } from '../../model/errorCheckAlgorithm';
import { GatewayCommProtocolIOTag } from '../../model/gatewayCommIOTags';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { DataSubProtocol } from 'src/app/shared/model/dataSubProtocol';



@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  public gatewayCommProtocol: GatewayCommProtocol;
  public dataSubProtocol: DataSubProtocol;
  apiurl = environment.baseUrl_gatewayManagement;
  constructor(private httpClient: HttpClient) {
  }

  getCommProtocolParamsByCommProtocolId(commProtocolId: any) {
    return this.httpClient.get<CommProtocolParam[]>(this.apiurl + 'commProtoclsParamsByCommProtocolId/' + commProtocolId);
  }


  getGatewayCommProtocolsByGatewayId(gatewayId) {
    return this.httpClient.get<GatewayCommProtocol[]>(this.apiurl + 'gatewayCommProtocolsByNodeId/' + gatewayId);
  }


  getDataHandlerFormats() {
    return this.httpClient.get<DataProtocolFormat[]>(this.apiurl + 'dataProtocolFormats');
  }

  getCommProtocolParamValue(id) {
    return this.httpClient.get<CommProtocolParamValue[]>(this.apiurl + 'getAllProtocolParamValueByProtocolParamId/' + id);
  }

  saveGatewayCommProtocol(commProtocol: GatewayCommProtocol): Observable<GatewayCommProtocol> {
    return this.httpClient.post<GatewayCommProtocol>(this.apiurl + 'gatewayCommProtocolParamvalue/gatewayCommProtocol', commProtocol);
  }

  getErrorCheckTypes() {
    return this.httpClient.get<ErrorChecktype[]>(this.apiurl + 'errorCheckTypes');
  }

  getErrorCheckAlgorithmByErrorCheckTypeId(errorCheckTypeId) {
    return this.httpClient.get<ErrorCheckAlgorithm[]>(this.apiurl + 'errorCheckAlgorithms/' + errorCheckTypeId);
  }

  setGatewayCommProtocol(gatewayCommProtocol: GatewayCommProtocol) {
    this.gatewayCommProtocol = gatewayCommProtocol;
  }

  getGatewayCommIOTagsByGatewayCommProtocolId(gatewayCommProtocolId) {
    return this.httpClient.get<GatewayCommProtocolIOTag[]>(this.apiurl + 'gatewayCommIOTagsByGatewayCommProtocolId/' + gatewayCommProtocolId);
  }

  getGatewayCommIODHsByGatewayCommProtocolId(gatewayCommProtocolId) {
    return this.httpClient.get<GatewayIODataHandler[]>(this.apiurl + 'gatewayCommIODHsByGatewayCommProtocolId/' + gatewayCommProtocolId);
  }

  deleteGatewayCommIOTag(commIOTag: GatewayCommProtocolIOTag) {
    return this.httpClient.put<GatewayCommProtocolIOTag>(this.apiurl + 'gatewayCommIOTagDelete', commIOTag)
  }

  deleteGatewayIODataHandler(id, userId) {
    return this.httpClient.delete<void>(this.apiurl + 'deleteGatewayIODH/' + id + '/' + userId)
  }

  setDataSubProtocol(dataSubProtocol: DataSubProtocol){
    this.dataSubProtocol = dataSubProtocol;
  }

  getDataTypes(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiurl + 'getDataTypes');
  }
}
