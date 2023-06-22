import { NavbarComponent } from '../shared/navbar/navbar.component';
import { isDefined } from '@angular/compiler/src/util';
import { Subscription } from 'rxjs/Subscription';
import Swal from 'sweetalert2';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AccesoService } from '../servicios/acceso.service';
import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';
import { timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  
    users:any;
    userabervable$:any;
    currentstatus:any;
    interval:any;
    usuario: any;
    departamento: any;
    sdepartamento: any;
    cdepartamento: any;
    opdepartamento: any;
    estadot:any=1;
    estadof:any=0;
    numero:any;
    numeroc:any;
    numerop:any;
    numerof:number=0;
    numerou:number;
    numerous:number;
    numerouc:number;
    numerouop:number;
    nombre:any;
    nombref:any='';
    nombrec:any;
    nombrep:any;
    apellido:any;
    apellidof:any='';
    apellidoc:any;
    apellidop:any;
    fecha:any;
    fechac:any;
    fechap:any;
    fechaf:any;
    fechau:any;
    fechaus:any;
    fechauc:any;
    fechauop:any;
    cedula:any;
    cedulac:any;
    cedulap:any;
    cedulaf:any='';
    turno:any;
    turnoc:any;
    turnop:any;
    bandera:string='';
    departamentof:any='';
    departamentou:any;
    departamentous:any;
    departamentouc:any;
    departamentouop:any;
    idDepartamento:any;
    cedulaSesion: any;
    estado: string='';
    idSesion: any=0;
    focus;
    focus1;
    focus2;
    hoy:any;
    hora:any;
    sturno:number;
    cturno:number;
    opturno:number;
    ultimo:any;
    ultimos:any;
    ultimoc:any;
    ultimoop:any;

    model = {
        left: true,
        middle: false,
        right: false
    };

    constructor(private servicio: AccesoService,
      private router: Router) { }

    ngOnInit(): void {
      if(this.servicio.subscription==undefined){
        this.observableTimer();
      }else{
        this.pausar();
        this.observableTimer();
      }
      
      this.consultarSturnos();
      this.consultarCturnos();
      this.consultarOpturnos();

        this.fechajs();
        this.fechaf=this.hoy;
        if(this.servicio.claveSesion=='123'){
          this.router.navigateByUrl("register")
          Swal.fire('Actualice su clave','','warning');
        }
        console.log(this.servicio.usuarioId);
        this.cedulaSesion=this.servicio.cedulaSesion;
        this.idSesion=this.servicio.usuarioId;
        if(this.idSesion<1){
          this.estado='sin sesion';
          console.log(this.estado);
        }else{
          this.consultarUsuario();
          this.estado='logeado';
          console.log(this.estado);
          this.validador=true;
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
          this.consultar();
          this.consultarc();
          this.consultarp();
        });
      }
   
      consultar(){
        let body={
            'accion': 'consultar_tactivo',
            'estado': this.estadot,
            'fecha': this.fechaf,
            'departamento': 'secretaria'
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                this.turno=res.datos;
                this.cedula = this.turno[0].cedula;
                this.nombre = this.turno[0].nombre;
                this.apellido = this.turno[0].apellido;
                this.fecha = this.turno[0].fecha;
                this.numero = this.turno[0].numero;
              }else{
                
              }
            });
          });
      }

      consultarc(){
        let body={
            'accion': 'consultar_tactivoc',
            'estado': this.estadot,
            'fecha': this.fechaf,
            'departamento': 'cobranzas'
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                this.turnoc=res.datos;
                this.cedulac = this.turnoc[0].cedula;
                this.nombrec = this.turnoc[0].nombre;
                this.apellidoc = this.turnoc[0].apellido;
                this.fechac = this.turnoc[0].fecha;
                this.numeroc = this.turnoc[0].numero;
              }else{
                
              }
            });
          });
      }

      consultarp(){
        let body={
            'accion': 'consultar_tactivop',
            'estado': this.estadot,
            'fecha': this.fechaf,
            'departamento': 'obras publicas'
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                this.turnop=res.datos;
                this.cedulap = this.turnop[0].cedula;
                this.nombrep = this.turnop[0].nombre;
                this.apellidop = this.turnop[0].apellido;
                this.fechap = this.turnop[0].fecha;
                this.numerop = this.turnop[0].numero;
              }else{
                
              }
            });
          });
      }

      pausar(){
        this.servicio.subscription.unsubscribe();
        this.servicio.subscription=undefined;
      }

      public validador; 
    validadorDeCedula(cedulaf: String) {
    let cedulaCorrecta = false;
    if (cedulaf.length == 10)
    {    
        let tercerDigito = parseInt(cedulaf.substring(2, 3));
        if (tercerDigito < 6) {
            // El ultimo digito se lo considera dígito verificador
            let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];       
            let verificador = parseInt(cedulaf.substring(9, 10));
            let suma:number = 0;
            let digito:number = 0;
            for (let i = 0; i < (cedulaf.length - 1); i++) {
                digito = parseInt(cedulaf.substring(i, i + 1)) * coefValCedula[i];      
                suma += ((parseInt((digito % 10)+'') + (parseInt((digito / 10)+''))));
          //      console.log(suma+" suma"+coefValCedula[i]); 
            }
            suma= Math.round(suma);
          //  console.log(verificador);
          //  console.log(suma);
          //  console.log(digito);
            if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10)== verificador)) {
                cedulaCorrecta = true;
            } else if ((10 - (Math.round(suma % 10))) == verificador) {
                cedulaCorrecta = true;
            } else {
                cedulaCorrecta = false;
            }
          } else {
            cedulaCorrecta = false;
          }
    } else {
          cedulaCorrecta = false;
    }
    this.validador= cedulaCorrecta;
    }

    consultarUsuario(){
      let body={
        'accion': 'consultar_uturnos',
        'id_usuario': this.idSesion
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.usuario=res.datos;
            this.cedulaf = this.usuario[0].cedula;
            this.nombref = this.usuario[0].nombre;
            this.apellidof = this.usuario[0].apellido;
          }else{
            Swal.fire('No existe el usuario');
          }
        }, (err)=>{
          Swal.fire('Error','Error de conexión','error');
        });
      });
    }

    guardar(){
      if(this.validador==true){
        if(this.nombref==''){
          Swal.fire('Error','Ingrese el nombre','error');
        }else if(this.apellidof==''){
          Swal.fire('Error','Ingrese el apellido','error');
        }else if(this.cedulaf==''){
          Swal.fire('Error','Ingrese la cedula','error');
        }else if(this.departamentof==''){
          Swal.fire('Error','Ingrese la departamento','error');
        }else{
          let body={
            'accion':'guardar_nturno',
            'nombre': this.nombref,
            'apellido': this.apellidof,
            'fecha': this.fechaf,
            'cedula': this.cedulaf,
            'numero': this.numerof,
            'estado': this.estadof,
            'departamento': this.idDepartamento
          }
          console.log(body);
            return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              this.usuario=res;
              if(res.estado){
              this.servicio.nombre=this.nombref;
              this.servicio.apellido=this.apellidof;
              this.servicio.cedula=this.cedulaf;
              this.servicio.fecha=this.fechaf;
              this.servicio.departamento=this.departamentof;
              this.servicio.numero=this.numerof;
              this.ngOnInit();
              this.router.navigateByUrl("turno") 
              Swal.fire('Turno guardado'); 
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
          else{
          Swal.fire('Error','Cédula inválida','error');
      }
  }

  consultarDepartamento(){
    let body={
      'accion': 'consultar_departamento',
      'nombre': this.departamentof
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.departamento=res.datos;
          this.idDepartamento = this.departamento[0].id_departamento;
          this.guardar();
        }else{
          Swal.fire('Seleccione un departamento');
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });
  }

  consultarSturnos(){
    let body={
      'accion': 'consultar_sturnos',
      'nombre': 'secretaria'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.sdepartamento=res.datos;
          this.sturno = this.sdepartamento[0].turnos_diarios;
          this.consultarUltimoS();
        }else{
          Swal.fire('Seleccione un departamento');
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });

  }

  consultarCturnos(){
    let body={
      'accion': 'consultar_cturnos',
      'nombre': 'cobranzas'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.cdepartamento=res.datos;
          this.cturno = this.cdepartamento[0].turnos_diarios;
          this.consultarUltimoC();
        }else{
          Swal.fire('Seleccione un departamento');
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });
  }

  consultarOpturnos(){
    let body={
      'accion': 'consultar_opturnos',
      'nombre': 'obras publicas'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.opdepartamento=res.datos;
          this.opturno = this.opdepartamento[0].turnos_diarios;
          this.consultarUltimoOp();
        }else{
          Swal.fire('Seleccione un departamento');
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });
  }

  consultarUltimo(){
    let body={
      'accion': 'consultar_ultimot'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.ultimo=res.datos;
          let id_turno = this.ultimo[0].id_turno;
          this.fechau = this.ultimo[0].fecha;
          this.numerou = this.ultimo[0].numero;
          this.departamentou = this.ultimo[0].departamento;
          this.comprobaciones();
        }else{
          
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });
}

consultarUltimoS(){
  let body={
    'accion': 'consultar_usecretaria'
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        this.ultimos=res.datos;
        let id_turnos = this.ultimos[0].id_turno;
        this.fechaus = this.ultimos[0].fecha;
        this.numerous = this.ultimos[0].numero;
        this.departamentous = this.ultimos[0].departamento;
      }else{
        
      }
    }, (err)=>{
      Swal.fire('Error','Error de conexión','error');
    });
  });
}

consultarUltimoC(){
  let body={
    'accion': 'consultar_ucobranzas'
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        this.ultimoc=res.datos;
        let id_turnoc = this.ultimoc[0].id_turno;
        this.fechauc = this.ultimoc[0].fecha;
        this.numerouc = this.ultimoc[0].numero;
        this.departamentouc = this.ultimoc[0].departamento;
      }else{
        
      }
    }, (err)=>{
      Swal.fire('Error','Error de conexión','error');
    });
  });
}

consultarUltimoOp(){
  let body={
    'accion': 'consultar_uobrasp'
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        this.ultimoop=res.datos;
        let id_turnoop = this.ultimoop[0].id_turno;
        this.fechauop = this.ultimoop[0].fecha;
        this.numerouop = this.ultimoop[0].numero;
        this.departamentouop = this.ultimoop[0].departamento;
      }else{
        
      }
    }, (err)=>{
      Swal.fire('Error','Error de conexión','error');
    });
  });
}

  comprobaciones(){
    if(this.departamentof=='secretaria'){
      if(this.fechaus!=this.hoy){
        console.log('0 turnos, secretaría');
        this.estadof=1;
        this.numerof=1;
        this.consultarDepartamento();
      }else if(this.fechaus==this.hoy){
        if(this.numerous!=this.sturno){
          console.log('if');
          this.estadof=0;
          this.numerof=this.numerous*1+1;
          console.log('Nuevo turno= '+ this.numerof);
          this.consultarDepartamento();
        }else{
          Swal.fire('Error','Ya no hay turnos para secretaría');
          this.ngOnInit();
        }
      }
    }
    else if(this.departamentof=='cobranzas'){
      if(this.fechauc!=this.hoy){
        console.log('0 turnos, cobranzas');
        this.estadof=1;
        this.numerof=1;
        this.consultarDepartamento();
      }else if(this.fechauc==this.hoy){
        if(this.numerouc!=this.cturno){
          console.log('if');
          this.estadof=0;
          this.numerof=this.numerouc*1+1;
          console.log('Nuevo turno= '+ this.numerof);
          this.consultarDepartamento();
        }else{
          Swal.fire('Error','Ya no hay turnos para cobranzas');
          this.ngOnInit();
        }
      }
    }
    else if(this.departamentof=='obras publicas'){
      if(this.fechauop!=this.hoy){
        console.log('0 turnos, obras públicas');
        this.estadof=1;
        this.numerof=1;
        this.consultarDepartamento();
      }else if(this.fechauop==this.hoy){
        if(this.numerouop!=this.opturno){
          console.log('if');
          this.estadof=0;
          this.numerof=this.numerouop*1+1;
          console.log('Nuevo turno= '+ this.numerof);
          this.consultarDepartamento();
        }else{
          Swal.fire('Error','Ya no hay turnos para obras públicas');
          this.ngOnInit();
        }
      }
    }
  }

}
