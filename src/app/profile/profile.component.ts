import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

    usuario: any;
    nombre: string='';
    apellido: string='';
    clave: string='123';
    cedula: string='';
    estado: string='';
    cedulaSesion: any;
    idSesion: any=0;
    u: any=0;
    test : Date = new Date();
    focus;
    focus1;
    focus2;

    constructor(private servicio: AccesoService,
        private router: Router) { }

    ngOnInit(): void {
    }

    public validador; 
    validadorDeCedula(cedula: String) {
    let cedulaCorrecta = false;
    if (cedula.length == 10)
    {    
        let tercerDigito = parseInt(cedula.substring(2, 3));
        if (tercerDigito < 6) {
            // El ultimo digito se lo considera dígito verificador
            let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];       
            let verificador = parseInt(cedula.substring(9, 10));
            let suma:number = 0;
            let digito:number = 0;
            for (let i = 0; i < (cedula.length - 1); i++) {
                digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];      
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

    recuperar(){
        if(this.nombre==''){
            Swal.fire('Error','Ingrese el nombre','error');
          }else if(this.apellido==''){
            Swal.fire('Error','Ingrese el apellido','error');
          }else if(this.cedula==''){
            Swal.fire('Error','Ingrese la cédula','error');
          }else{
            if(this.validador==true){
                console.log('Recuperación de clave')
            let body={
              'accion':'recuperar_cservicios',
              'cedula': this.cedula,
              'nombre': this.nombre,
              'apellido': this.apellido,
              'clave': this.clave
            }
            return new Promise(resolve=>{
              this.servicio.postData(body).subscribe((res:any)=>{
                this.usuario=res;
                if(res.estado){
                    Swal.fire('Clave reseteada', 'Nueva clave: "123"');
                    this.router.navigateByUrl("login") 
                }else{
                    Swal.fire('Clave no recuperada','error');
                }
              }, (err)=>{
                //Error
                console.log(err);
                Swal.fire('Error','Error de conexión','error');
              });
            });
            }else{
                Swal.fire('Error','Cédula inválida','error');
            }
          }
    }
}
