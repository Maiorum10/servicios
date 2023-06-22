import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: any;
  nombre: any;
  mensajes:any;
  clave: string='';
  cedula: string='';
  focus;
  focus1;

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit() { }
  verificar(){
    if(this.cedula==''){
      Swal.fire('Error','Ingrese la cédula','error');
    }else if(this.clave==''){
      Swal.fire('Error','Ingrese la clave','error');
    }else{
      let body={
        'accion': 'login_servicios',
        'cedula': this.cedula,
        'clave' : this.clave
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.usuario=res.datos;
            this.servicio.usuarioId=this.usuario[0].id_empleado;
            this.servicio.cedulaSesion=this.usuario[0].cedula;
            this.nombre=this.usuario[0].nombre;
            this.servicio.claveSesion=this.clave;
            Swal.fire('Bienvenido','' +this.nombre+ '');
            this.router.navigateByUrl("navbar") 
          }else{
            Swal.fire('Error','Datos incorrectos','error');
          }
        },(err)=>{
          Swal.fire('Error','Error de conexión','error');
          console.log('Error de conexión, login');
        });
      });
    }
  }

  pausar(){
    if(this.servicio.subscription!=undefined){
        this.servicio.subscription.unsubscribe();
        this.servicio.subscription=undefined;
    }
    
  }
}
