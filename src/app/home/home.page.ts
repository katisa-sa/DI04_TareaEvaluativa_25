import { Component, Input } from '@angular/core';
import { GestionApiService } from '../services/gestion-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  tipoDeChartSeleccionado: string = "bar-chart";
  numeroChart: string = "";

  backgroundColorCat: string[] = ['rgba(255, 99, 132, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 205, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)','rgba(153, 102, 255, 0.2)','rgba(201, 203, 207, 0.2)'];
  borderColorCat: string[] =['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)','rgb(153, 102, 255)','rgb(201, 203, 207)'];
  categorias: string[] = ["business","entertainment","general","technology","health","science","sports"];
  

  constructor(public gestionServiceApi: GestionApiService) {}

  ngOnInit() {
    this.categorias.forEach((categoria => {
      this.gestionServiceApi.cargarCategoria(categoria);
    }));
  }

  segmentChanged(event: any) {
    
    //Recogemos el tipo de chart (bar-chart, line-chart o pie-chart), mediante event.detail.value
    this.tipoDeChartSeleccionado = event.detail.value;
  }
  
}
