import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccesoService } from '../servicios/acceso.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {

  focus;
  focus1;
  focus2;
  idSesion:any;
  anverso:any=[];

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit(): void {
    this.idSesion=this.servicio.usuarioId;
    if(this.idSesion<1){
      Swal.fire('Inicie sesión');
      this.router.navigateByUrl("login") 
    }else{
      this.cargarSeguimiento();
      document.getElementById('btns').style.display = 'block';
    }
  }

  pdf(){
    document.getElementById('btns').style.display = 'none';
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('seguimiento.pdf');
      this.router.navigateByUrl("home") 
    });
  }

  cargarSeguimiento(){
    let body={
      'accion': 'consultar_seguimiento',
      'id_seguimiento_ticket': this.servicio.id_seguimiento
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let seguimiento=res.datos;
          this.anverso=seguimiento;
        }else{
          this.anverso=[];
        }
      });
    });
  }

}
