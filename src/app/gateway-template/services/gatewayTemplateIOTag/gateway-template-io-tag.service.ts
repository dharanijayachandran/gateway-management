import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GatewayTemplateIOTag } from '../../model/gateway-template-io-tag';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class GatewayTemplateIoTagService {

  constructor(private http: HttpClient) { }
  apiurl = environment.baseUrl_gatewayManagement;
  getGatewayTemplateIOTagByGatewayTemplateId(gatewayTemplateId): Observable<GatewayTemplateIOTag[]> {
    return this.http.get<GatewayTemplateIOTag[]>(this.apiurl + 'getAllGatewayIOTagByGatewayId/' + gatewayTemplateId);
  }
  getGatewayTemplateIOTagByIOTagId(gatewayTemplateIOTagId): Observable<GatewayTemplateIOTag> {
    return this.http.get<GatewayTemplateIOTag>(this.apiurl + 'getGatewayTemplateIOTagByIOTagId/' + gatewayTemplateIOTagId);
  }
  addGatewayTemplateIOTag(gatewayTemplateIOTag: GatewayTemplateIOTag): Observable<GatewayTemplateIOTag> {
    return this.http.post<GatewayTemplateIOTag>(`${this.apiurl + 'addGatewayIOTag'}`, gatewayTemplateIOTag, httpOptions);
  }
  updateGatewayTemplateIOTag(gatewayTemplateIOTag: GatewayTemplateIOTag): Observable<GatewayTemplateIOTag> {
    return this.http.put<GatewayTemplateIOTag>(`${this.apiurl + 'updateGatewayIOTag'}`, gatewayTemplateIOTag, httpOptions);
  }
  deleteGatewayTemplateIOTag(gatewayTemplateIOTagId, userId): Observable<GatewayTemplateIOTag> {
    return this.http.delete<GatewayTemplateIOTag>(`${this.apiurl + 'deleteGatewayIOTag/' + gatewayTemplateIOTagId + '/' + userId}`, httpOptions);
  }
}
