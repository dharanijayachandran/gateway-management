import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataProtocol } from '../../model/dataProtocol';
import { GatewayCommProtocol } from '../../model/gatewayCommProtocol';
import { GatewayTemplate } from '../../model/gatewayTemplate';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GatewayTemplateService {

  apiurl = environment.baseUrl_gatewayManagement;

  constructor(private http: HttpClient) { }

  addGatewayTemplate(gatewayTemplate: GatewayTemplate): Observable<GatewayTemplate> {
    return this.http.post<GatewayTemplate>(`${this.apiurl + 'saveGatewayTemplate'}`, gatewayTemplate, httpOptions);
  }

  updateGatewayTemplate(gatewayTemplate: GatewayTemplate): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'gatewayTemplate'}`, gatewayTemplate, httpOptions);
  }

  getGatewayTemplatesList(id): Observable<GatewayTemplate[]> {
    return this.http.get<GatewayTemplate[]>(this.apiurl + 'gatewayTemplatesByBusinessEntityId/' + id);
  }

  getGatewayTemplateByTemplateId(id: number): Observable<GatewayTemplate> {
    return this.http.get<GatewayTemplate>(this.apiurl + 'gatewayTemplateById/' + id);
  }

  getGatewaysByTemplateId(id: number): Observable<GatewayTemplate[]> {
    return this.http.get<GatewayTemplate[]>(this.apiurl + 'getAllGateWaysByGateWayTemplateId/' + id);
  }
  deleteGatewayTemplate(id, userId): Observable<void> {
    return this.http.delete<void>(`${this.apiurl + 'gatewayTemplate/' + id + '/' + userId}`, httpOptions);
  }

  getCommProtocols(): Observable<GatewayCommProtocol[]> {
    return this.http.get<GatewayCommProtocol[]>(this.apiurl + 'getAllProtocol');
  }

  getDataProtocols(): Observable<DataProtocol[]> {
    return this.http.get<DataProtocol[]>(this.apiurl + 'dataProtocols');
  }

  getDataProtocolsByCommProtocolId(commProtocolId: number): Observable<DataProtocol[]> {
    let organizationId = sessionStorage.getItem("beId");
    return this.http.get<DataProtocol[]>(this.apiurl + 'dataProtocols/' + commProtocolId + "/" + organizationId);
  }
}
