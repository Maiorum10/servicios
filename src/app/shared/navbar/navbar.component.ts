import { subscribeOn } from 'rxjs-compat/operator/subscribeOn';
import { HomeComponent } from './../../home/home.component';
import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { AccesoService } from '../../servicios/acceso.service';
import Swal from 'sweetalert2';

@Component({
    providers:[HomeComponent],
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(public location: Location, private router: Router,
        private comp: HomeComponent, private servicio: AccesoService) {
    }

    ngOnInit() {
        
        if(this.servicio.usuarioId=='0'){
            this.uno();
            this.router.navigateByUrl("");
        }else if(this.servicio.usuarioId!='0'){
            this.dos();
            this.router.navigateByUrl("home");
        }

      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
        if (event instanceof NavigationStart) {
           if (event.url != this.lastPoppedUrl)
               this.yScrollStack.push(window.scrollY);
       } else if (event instanceof NavigationEnd) {
           if (event.url == this.lastPoppedUrl) {
               this.lastPoppedUrl = undefined;
               window.scrollTo(0, this.yScrollStack.pop());
           } else
               window.scrollTo(0, 0);
       }
     });
     this.location.subscribe((ev:PopStateEvent) => {
         this.lastPoppedUrl = ev.url;
     });
    }

    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '#/home' ) {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '#/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }

    pausar(){
        if(this.servicio.subscription!=undefined){
            this.servicio.subscription.unsubscribe();
            this.servicio.subscription=undefined;
        }
        
      }

    uno(){
        document.getElementById('btn_logout').style.display = 'none';
        document.getElementById('btn_actualizar').style.display = 'none';
        document.getElementById('btn_correo').style.display = 'none';
        document.getElementById('btn_login').style.display = 'none';
        document.getElementById('btn_tickets').style.display = 'none';
    }   

    dos(){
        document.getElementById('btn_logout').style.display = 'block';
        document.getElementById('btn_actualizar').style.display = 'block';
        document.getElementById('btn_correo').style.display = 'block';
        document.getElementById('btn_login').style.display = 'none';
        this.consultarEncargado();
    }

    refresh(): void {
        this.pausar();
        this.servicio.usuarioId='0';
        this.servicio.cedulaSesion='0';
        this.servicio.subscription=undefined;
        this.servicio.nombre='';
        this.servicio.apellido='';
        this.servicio.cedula='';
        this.servicio.fecha='';
        this.servicio.departamento='';
        this.servicio.numero='';
        this.router.navigateByUrl("navbar");
        Swal.fire('Ha cerrado su sesión');
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
              document.getElementById('btn_tickets').style.display = 'block';
            }else{
                document.getElementById('btn_tickets').style.display = 'none';
            }
          });
        });
      }
    
}
