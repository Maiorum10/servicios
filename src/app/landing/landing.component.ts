import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {
  focus: any;
  focus1: any;
  idSesion:any=0;
  hoy:any;
  hora:any;
  nombre:any;
  apellido:any;
  motivo:any='';

  constructor(private servicio: AccesoService,
    private router: Router) { }

    ngOnInit(): void {
      this.idSesion=this.servicio.usuarioId;
      if(this.idSesion<1){
        Swal.fire('Inicie sesión');
        this.router.navigateByUrl("login") 
      }
  
      if(this.servicio.claveSesion=='123'){
        this.router.navigateByUrl("register")
        Swal.fire('Actualice su clave','','warning');
      }

      this.fechajs();
      this.nombre=this.servicio.empleadoNombre;
      this.apellido=this.servicio.empleadoApellido;
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

  guardar(){
    this.fechajs();
      if(this.motivo==''){
        Swal.fire('Error','Ingrese un motivo','error');
      }else{
        let body={
          'accion':'guardar_nuevo_ticket',
          'id_empleado_uno': this.servicio.usuarioId,
          'id_empleado_dos': this.servicio.empleadoId,
          'motivo':this.motivo,
          'fecha_inicio': this.hoy,
          'estado':'progreso',
          'redireccionado':'no'
        }
        console.log(body);
          return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            let tick=res;
            if(res.estado){
              Swal.fire('','Ticket creado exitosamente','success');
              this.router.navigateByUrl("home")
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

}
