import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { empty, timer } from 'rxjs';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {

  focus;
  focus1;
  focus2;
  idSesion:any;
  nombre:any;
  apellido:any;
  cedula:any;
  tickets:any=[];
  hoy:any;
  hora:any;
  bandera:any=1;
  reverso:any;
  anverso:any;
  id_empleado:any;
  fecha:any;
  fecha_fin:any;
  motivo:any;
  resolucion:any;
  redireccionado:any;
  ticket:any;
  id_ticket:any;
  servicios:any;
  state = false;
  buscador:any='';
  estado:any;
  id_seguimiento:any=null;
  id_seguimiento_ticket:any;
  id_empleado2:any;

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit(): void {
    this.idSesion=this.servicio.usuarioId;
    if(this.idSesion<1){
      Swal.fire('Inicie sesión');
      this.router.navigateByUrl("login") 
    }else{
      this.fechajs();
      this.observableTimer();
      this.uno();
      this.cargarTabla1();
    }

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
        this.cargarTabla1()
      }else if(this.bandera==2){
        this.cargarTabla2()
      }
    });
  }

  pausar(){
    this.servicio.subscription.unsubscribe();
  }

  uno(){
    document.getElementById('tickets').style.display = 'block';
    document.getElementById('servicio').style.display = 'none';
    document.getElementById('seg').style.display = 'none';
  }

  dos(){
    document.getElementById('tickets').style.display = 'none';
    document.getElementById('servicio').style.display = 'block';
  }

  cargarTabla1(){
    let body={
      'accion': 'consultar_tickets',
      'id_empleado_uno': this.servicio.usuarioId,
      'estado': 'progreso'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.tickets=res.datos;
          this.anverso=this.tickets.reverse();
        }else{
          this.anverso=[];
        }
      });
    });
  }

  cargarTabla2(){
    let body={
      'accion': 'consultar_tickets',
      'id_empleado_uno': this.servicio.usuarioId,
      'estado': 'finalizado'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.tickets=res.datos;
          this.anverso=this.tickets.reverse();
        }else{
          this.anverso=[];
        }
      });
    });
  }

  btn_1(){
    this.bandera=1;
    this.si();
  }

  btn_2(){
    this.bandera=2;
    this.si();
  }

  si(){
    if(this.bandera==1){
      this.cargarTabla1();
      this.desbloquear()
    }else if(this.bandera==2){
      this.cargarTabla2();
      this.bloquear()
    }
  }

  removeId(tr){
    this.id_ticket=tr.id_ticket;
    this.id_empleado=tr.id_empleado_dos;
    this.nombre=tr.nombre;
    this.apellido=tr.apellido;
    this.redireccionado=tr.redireccionado;
    this.id_seguimiento_ticket=tr.id_seguimiento_ticket;
    if(this.bandera==1){
      this.cargarServicios();
      this.cargarTicket();
      this.dos();
      document.getElementById('guardar').style.display = 'block';
    }else if(this.bandera==2){
      this.cargarTicket();
      this.dos();
      document.getElementById('guardar').style.display = 'none';
      if(this.id_seguimiento_ticket!=null){
        document.getElementById('seg').style.display = 'block';
      }
    }
  }

  cargarTicket(){
    let body={
      'accion': 'consultar_ticket',
      'id_ticket': this.id_ticket
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.ticket=res.datos;
          if(this.bandera==1){
            this.fecha = this.ticket[0].fecha_inicio;
            this.motivo = this.ticket[0].motivo;
            this.fecha_fin=this.hoy;
            this.resolucion='';
          }else if(this.bandera==2){
            this.fecha = this.ticket[0].fecha_inicio;
            this.motivo = this.ticket[0].motivo;
            this.resolucion = this.ticket[0].resolucion;
            this.fecha_fin = this.ticket[0].fecha_fin;
          }
        }else{
          
        }
      });
    });
  }

  cargarServicios(){
    let body={
      'accion': 'consultar_servicios',
      'id_ticket': this.id_ticket
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.servicios=res.datos;
        }else{
          
        }
      });
    });
  }

  guardar(){
    this.anverso=[];
    if(this.resolucion==''){
      Swal.fire('Error','Ingrese una resolución','error');
    }else if (this.id_seguimiento_ticket==null){
      if(this.redireccionado=='no'){
        let body={
          'accion':'actualizar_ticket',
          'id_ticket':this.id_ticket,
          'fecha_fin': this.hoy,
          'resolucion': this.resolucion,
          'redireccionado': this.redireccionado
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            let tick=res;
            if(res.estado){
              Swal.fire('','Guardado correctamente','success');
              this.uno();
            }else{
                Swal.fire('Error','Error','error');
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Error de conexión','error');
          });
        });
      }else if(this.redireccionado!='no'){
        let body={
          'accion':'guardar_seguimiento'
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            let seg=res;
            if(res.estado){
              let body={
                'accion': 'consultar_ultimos'
              }
              return new Promise(resolve=>{
                this.servicio.postData(body).subscribe((res:any)=>{
                  if(res.estado){
                    let seg=res.datos;
                    this.id_seguimiento = seg[0].id_seguimiento_ticket;
                    let body={
                      'accion':'actualizar_ticket2',
                      'id_ticket': this.id_ticket,
                      'fecha_fin': this.hoy,
                      'resolucion': this.resolucion,
                      'redireccionado': this.redireccionado,
                      'id_seguimiento_ticket': this.id_seguimiento
                    }
                    console.log(body);
                      return new Promise(resolve=>{
                      this.servicio.postData(body).subscribe((res:any)=>{
                        let tick=res;
                        if(res.estado){
                          let body={
                            'accion':'guardar_ticket',
                            'id_empleado_uno': this.id_empleado2,
                            'id_empleado_dos': this.id_empleado,
                            'motivo':'Redireccionado: '+this.resolucion,
                            'fecha_inicio': this.hoy,
                            'estado':'progreso',
                            'redireccionado':'no',
                            'id_seguimiento_ticket': this.id_seguimiento
                          }
                          console.log(body);
                            return new Promise(resolve=>{
                            this.servicio.postData(body).subscribe((res:any)=>{
                              let tick=res;
                              if(res.estado){
                                Swal.fire('','Ticket redireccionado creado exitosamente','success');
                                this.uno();
                              }else{
                                  Swal.fire('Error','Error al redireccionar','error');
                              }
                            }, (err)=>{
                              //Error
                              console.log(err);
                              Swal.fire('Error','Error de conexión','error');
                            });
                          });
                        }else{
                          console.log('error 3')
                        }
                      }, (err)=>{
                        //Error
                        console.log(err);
                        Swal.fire('Error','Error de conexión','error');
                      });
                    });
                  }else{
                    console.log('error 2')
                  }
                });
              });
            }else{
              console.log('error 1')
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Error de conexión','error');
          });
        });
      }
    }else if (this.id_seguimiento_ticket!=null){ /////////////////////////////////////////////////////////////////////
      if(this.redireccionado=='no'){
        let body={
          'accion':'actualizar_ticket',
          'id_ticket': this.id_ticket,
          'fecha_fin': this.hoy,
          'resolucion': this.resolucion,
          'redireccionado': this.redireccionado
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            let tick=res;
            if(res.estado){
              Swal.fire('','Guardado correctamente','success');
              this.uno();
            }else{
                Swal.fire('Error','Error','error');
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Error de conexión','error');
          });
        });
      }else if(this.redireccionado!='no'){
        let body={
          'accion':'actualizar_ticket2',
          'id_ticket': this.id_ticket,
          'fecha_fin': this.hoy,
          'resolucion': this.resolucion,
          'redireccionado': this.redireccionado,
          'id_seguimiento_ticket': this.id_seguimiento_ticket
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            let tick=res;
            if(res.estado){
              let body={
                'accion':'guardar_ticket',
                'id_empleado_uno': this.id_empleado2,
                'id_empleado_dos': this.id_empleado,
                'motivo':'Redireccionado: '+this.resolucion,
                'fecha_inicio': this.hoy,
                'estado':'progreso',
                'redireccionado':'no',
                'id_seguimiento_ticket': this.id_seguimiento_ticket
              }
              console.log(body);
                return new Promise(resolve=>{
                this.servicio.postData(body).subscribe((res:any)=>{
                  let tick=res;
                  if(res.estado){
                    Swal.fire('','Ticket redireccionado creado exitosamente','success');
                    this.uno();
                  }else{
                      Swal.fire('Error','Error al redireccionar','error');
                  }
                }, (err)=>{
                  //Error
                  console.log(err);
                  Swal.fire('Error','Error de conexión','error');
                });
              });
            }else{
              console.log('error 3')
            }
          }, (err)=>{
            //Error
            console.log(err);
            Swal.fire('Error','Error de conexión','error');
          });
        });
      }
    }
    
  }

  bloquear(){
    this.state = !this.state;
  }

  desbloquear(){
    this.state = false;
  }

  dropdown(tr){
    this.redireccionado=tr.nombre;
    this.id_empleado2=tr.id_empleado;
  }

  buscadorUsuarios(){
    if(this.buscador!=''){
      this.pausar();
      if(this.bandera==1){
        this.estado='progreso'
        let body={
          'accion': 'buscador_usuarios',
          'estado': this.estado,
          'nombre': '%'+this.buscador+'%',
          'cedula': '%'+this.buscador+'%',
          'apellido': '%'+this.buscador+'%',
          'fecha_inicio': '%'+this.buscador+'%'
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            if(res.estado){
              this.anverso=res.datos;
            }else{
  
            }
          });
        });
      }else if(this.bandera==2){
        this.estado='finalizado'
        let body={
          'accion': 'buscador_usuarios',
          'estado': this.estado,
          'nombre': '%'+this.buscador+'%',
          'cedula': '%'+this.buscador+'%',
          'apellido': '%'+this.buscador+'%',
          'fecha_inicio': '%'+this.buscador+'%'
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            if(res.estado){
              this.anverso=res.datos;
            }else{
  
            }
          });
        });
      }
    }else if(this.buscador==''){
      this.anverso=[];
      this.observableTimer();
    }
  }

  seguimiento(){
    this.servicio.id_seguimiento=this.id_seguimiento_ticket;
    this.router.navigateByUrl("seguimiento")
  }

}
