import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: false
})
export class LineChartComponent  implements AfterViewInit {

public chart!: Chart;
   
  
@Input() backgroundColorCategorias: string[] = [];
@Input() borderColorCategorias: string[] = [];
@Input() nombresCategorias: string[] = [];
@Input() datosCategorias: number[] = [];
@Input() tipoChartSelected: string = "";
@Input() numeroChart: string = "";
   
 
   constructor(public renderer: Renderer2, public el: ElementRef, public gestionServiceApi: GestionApiService ) { }
 
   public apiData: { categoria: string, totalResults: number }[] = [];

   ngAfterViewInit() {  

    this.crearCanvasYDiv();
    this.inicializarChart();

      //Nos suscribimos al observable de tipo BehaviorSubject y cuando este emita un valor, recibiremos una notificación con el nuevo valor.
     this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        //Cuando recibimos un valor actualizamos los arrays de nombre y valor de categorias, para guardar el nombre y su valor en las mismas posiciones del array.
        this.apiData.push(datos);
        //Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
        this.actualizarChart();
      } 
      });
  } 
 
   private inicializarChart(){
    
    const datasetsByCompany: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[] = [];

    const canvas = this.el.nativeElement.querySelector(`#${this.tipoChartSelected}${this.numeroChart}LineChart`);
    if (!canvas) {
      console.error('Canvas no encontrado para inicializar el gráfico');
      return;
    }

   this.chart = new Chart(canvas, {
     type: 'line', // tipo de la gráfica 
     data: {
      labels: [],
      datasets: datasetsByCompany
      },
     options: { // opciones de la gráfica
       responsive: true,
       maintainAspectRatio: false,
       scales: {
         y: {
           beginAtZero: true
         }
       },
       plugins: {
         legend: {
           labels: {
             boxWidth: 0,
             font: {
               size: 12,
               weight: 'bold'
             }
           },
         }
       },
     }
   });
   this.chart.canvas.width = 100;
   this.chart.canvas.height = 100;
  }

  private actualizarChart(){
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};
    
    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => { 
      const categoria = row.categoria;
      const totalResults = row.totalResults;
    
      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCategorias[index]],
          borderColor: [this.borderColorCategorias[index]],
          borderWidth: 2
        };
      }
      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
    });

    if (this.chart){
    this.chart.data.labels = this.apiData.map((row) => row.categoria);
    this.chart.data.datasets = Object.values(datasetsByCompany);
    this.chart.update();
    }
  }

  private crearCanvasYDiv() {
   //Crear el elemento div    
   const div = this.renderer.createElement('div');
   // Establecer las propiedad del div que se necesiten
   this.renderer.setStyle(div, 'width', '100%');
   this.renderer.setStyle(div, 'height', '500px');
   this.renderer.setStyle(div, 'margin', 'auto');
   this.renderer.setStyle(div, 'text-align', 'center');
 
   // Añadir el atributo id al div
  this.renderer.setAttribute(div, 'id', 'container'+this.tipoChartSelected + this.numeroChart +'LineChart');

  // Crear el elemento canvas
  const canvas = this.renderer.createElement('canvas');
  //Añadir atributo id al canvas
  this.renderer.setAttribute(canvas, 'id', this.tipoChartSelected + this.numeroChart +'LineChart');

  // Agregar el canvas al div
  this.renderer.appendChild(div, canvas);
  // Agregar el div al elemento actual del componente
  this.renderer.appendChild(this.el.nativeElement, div);
  
  }
}