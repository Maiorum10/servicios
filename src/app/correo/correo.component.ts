import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import { empty, timer } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.component.html',
  styleUrls: ['./correo.component.css']
})
export class CorreoComponent implements OnInit {

    focus;
    focus1;
    focus2;
    mensajes:any;
    reverso:any;
    anverso:any;
    mensaje:any;
    idSesion:any=0;
    txt:any='';
    nombre:any;
    apellido:any;
    bandera:number=1;
    hoy:any;
    hora:any;
    servicios:any;
    buscador:any;
    id_empleado:any=0;
    state = false;
    empleados:any;

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit(): void {
    //this.mensajes=undefined;
    this.idSesion=this.servicio.usuarioId;
    if(this.idSesion<1){
      Swal.fire('Inicie sesión');
      this.router.navigateByUrl("login") 
    }else{
      this.consultarEncargado();
      this.uno();
      this.cargarTabla();
      this.observableTimer();
    }

    document.getElementById('ticket').style.display = 'none';

    if(this.servicio.claveSesion=='123'){
      this.router.navigateByUrl("register")
      Swal.fire('Actualice su clave','','warning');
    }
  }

  addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }

  fechajs(){
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    const currentHour =  this.addZero(currentDate.getHours());
    const currentMinutes = this.addZero(currentDate.getMinutes());

    this.hoy = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
    this.servicio.fecha=this.hoy;
    this.hora = currentHour +':'+ currentMinutes;
    this.servicio.hora=this.hora;
    console.log(this.hoy +' '+ this.hora);
  }

  observableTimer() {
    const source = timer(1000, 5000);
    this.servicio.subscription = source.subscribe(val => {
      console.log(val, '-');
      if(this.bandera==1){
        this.cargarTabla();
        this.cargarMensajes();
      }else if(this.bandera==2){
        this.cargarEmpleados();
        this.cargarMensajeria();
      }
    });
  }

  pausar(){
    this.servicio.subscription.unsubscribe();
  }

  cargarTabla(){
    let body={
      'accion': 'consultar_servicios'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.servicios=res.datos;
          this.anverso=this.servicios.reverse();
        }else{
          this.anverso=[];
        }
      });
    });
  }

  cargarMensajes(){
    let body={
      'accion': 'consultar_mensajes',
      'id_empleado2': this.servicio.usuarioId,
      'id_empleado': this.id_empleado
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.mensajes=res.datos;
          this.reverso=this.mensajes.reverse();
        }else{
          this.reverso=[];
        }
      });
    });
  }

  cargarMensajeria(){
    let body={
      'accion': 'consultar_mensajes',
      'id_empleado': this.servicio.usuarioId,
      'id_empleado2': this.id_empleado
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.mensajes=res.datos;
          this.reverso=this.mensajes.reverse();
        }else{
          this.reverso=[];
        }
      });
    });
  }

  cargarEmpleados(){
    let body={
      'accion': 'consultar_empleados',
      'id_empleado': this.servicio.usuarioId
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.servicios=res.datos;
          this.anverso=this.servicios.reverse();
        }else{
          this.anverso=[];
        }
      });
    });
  }

  consultarEncargado(){
    let body={
      'accion': 'consultar_encargado',
      'id_empleado': this.servicio.usuarioId
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let encargado=res.datos;
          document.getElementById('btn1').style.display = 'block';
          document.getElementById('btn2').style.display = 'block';
        }else{
          document.getElementById('btn1').style.display = 'block';
          document.getElementById('btn2').style.display = 'none';
          this.bloquear();
        }
      });
    });
  }

  guardarMensaje(){
    this.fechajs();
      if(this.txt==''){
        Swal.fire('Error','Ingrese un mensaje','error');
      }else{
        let body={
          'accion':'guardar_mensaje',
          'id_empleado2': this.servicio.usuarioId,
          'id_empleado': this.id_empleado,
          'remitente':'empleado',
          'mensaje':this.txt,
          'fecha': this.hoy,
          'hora': this.hora
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            this.mensaje=res;
            if(res.estado){
            this.cargarMensajes();
            this.txt='';
            }else{
                Swal.fire('Error','Error','error');
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Error de conexión','error');
          });
        });
      }
  }

  enviarMensaje(){
    this.fechajs();
      if(this.txt==''){
        Swal.fire('Error','Ingrese un mensaje','error');
      }else{
        let body={
          'accion':'guardar_mensaje',
          'id_empleado': this.servicio.usuarioId,
          'id_empleado2': this.id_empleado,
          'remitente':'encargado',
          'mensaje':this.txt,
          'fecha': this.hoy,
          'hora': this.hora
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            this.mensaje=res;
            if(res.estado){
            this.cargarMensajeria();
            this.txt='';
            }else{
                Swal.fire('Error','Error','error');
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Error de conexión','error');
          });
        });
      }
  }

  envios(){
    if(this.bandera==1){
      this.guardarMensaje();
    }else if(this.bandera==2){
      this.enviarMensaje();
    }
  }

  uno(){
    document.getElementById('chat').style.display = 'none';
    document.getElementById('servicios').style.display = 'block';
    document.getElementById('ticket').style.display = 'none';
    this.reverso=[];
  }

  dos(){
    document.getElementById('chat').style.display = 'block';
    document.getElementById('servicios').style.display = 'none';
  }

  removeId(tr){
    this.id_empleado=tr.id_empleado;
    this.nombre=tr.nombre;
    this.apellido=tr.apellido;
    if(this.bandera==1){
      this.cargarMensajes();
      this.dos();
    }else if(this.bandera==2){
      this.cargarMensajeria();
      this.dos();
      document.getElementById('ticket').style.display = 'block';
    }
  }

  bloquear(){
    this.state = !this.state;
  }

  btn_1(){
    this.bandera=1;
    this.si();
    document.getElementById('ticket').style.display = 'none';
  }

  btn_2(){
    this.bandera=2;
    this.si();
    document.getElementById('ticket').style.display = 'block';
  }

  si(){
    if(this.bandera==1){
      this.cargarTabla();
    }else if(this.bandera==2){
      this.cargarEmpleados();
    }
  }

  ticket(){
    this.servicio.empleadoId=this.id_empleado;
    this.servicio.empleadoNombre=this.nombre;
    this.servicio.empleadoApellido=this.apellido;
    this.router.navigateByUrl("landing")
  }

}