import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GatewayIODataHandler } from '../../model/gatewayIODataHandler';
import { Observable } from 'rxjs';
import { DataProtocolFormat } from '../../model/DataProtocolFormat';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GatewayIoDhService {

  apiurl = environment.baseUrl_gatewayManagement;

  constructor(private http: HttpClient) { }

  addGatewayIODataHndler(gatewayIODataHandler: GatewayIODataHandler): Observable<GatewayIODataHandler> {
    return this.http.post<GatewayIODataHandler>(`${this.apiurl + 'saveGatewayIODH'}`, gatewayIODataHandler, httpOptions);
  }

  updateGatewayIODataHndler(gatewayIODataHandler: GatewayIODataHandler): Observable<void> {
    return this.http.put<void>(`${this.apiurl + 'updateGatewayIODH'}`, gatewayIODataHandler, httpOptions);
  }

  getDataProtocolFormats(): Observable<DataProtocolFormat[]> {
    return this.http.get<DataProtocolFormat[]>(this.apiurl + 'dataProtocolFormats');
  }

  getGatewayIODataHandlerById(gatewayIODHId): Observable<GatewayIODataHandler> {
    return this.http.get<GatewayIODataHandler>(this.apiurl + 'gatewayIODHById/' + gatewayIODHId);
  }
}
