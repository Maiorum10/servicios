import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {
  empleadoId:any;
  empleadoNombre:any;
  empleadoApellido:any;
  usuarioId:string='0';
  cedulaSesion:string='0';
  claveSesion:string='0';
  subscription:any=undefined;
  nombre:any='';
  apellido:any='';
  cedula:any='';
  fecha:any='';
  hora:any;
  departamento:any='';
  numero:any='';
  id_seguimiento:any;

  //server : string='http://localhost:1023/api/api_turnos/crud.php';
  server : string= environment.URL + 'api_servicios/servicios.php';
  constructor(public http:HttpClient) { }

  private refresh=new Subject<void>();

  get Refreshrequired(){
    return this.refresh;
  }

  postData(body){
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset=UTF-8'
    });
    let options={
      headers:headers
    }
    return this.http.post(this.server, JSON.stringify(body), options);
  }
  getData(){
    let headers=new HttpHeaders({
      'Content-Type':'application/json; charset=UTF-8'
    });
    let options={
      headers:headers
    }
    return this.http.get(this.server,options);
  }

}