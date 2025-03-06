import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  standalone: false
})
export class PieChartComponent  implements AfterViewInit{

 public chart!: Chart;
   
 @Input() backgroundColorCategorias: string[] = [];
 @Input() borderColorCategorias: string[] = [];
 @Input() nombresCategorias: string[] = [];
 @Input() datosCategorias: number[] = [];
 @Input() tipoChartSelected: string = "";
 @Input() numeroChart: string = "";
   
 public apiData: { categoria: string, totalResults: number }[] = [];

   constructor(public renderer: Renderer2, public el: ElementRef, public gestionServiceApi: GestionApiService ) { }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
   
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
 
    const canvas = this.el.nativeElement.querySelector(`#${this.tipoChartSelected}${this.numeroChart}PieChart`);

    if (!canvas) {
      console.error('Canvas no encontrado para inicializar el gráfico');
      return;
    }

    this.chart = new Chart(canvas, {
     type: 'pie' as ChartType, // tipo de la gráfica 
     data: {
      labels: this.nombresCategorias,
      datasets: datasetsByCompany
      },
     options: { // opciones de la gráfica
       responsive: true,
       maintainAspectRatio: false,
       plugins: {
         legend: {
           labels: {
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
          borderWidth: 1
        };
      }
     
      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
    });

    if (this.chart){
    this.chart.data.labels = [];
    this.apiData.forEach((row: { categoria: string; totalResults: number }) => {
      if (this.chart.data.labels){
        this.chart.data.labels.push(row.categoria);
      }
    });
    this.chart.data.datasets = Object.values(datasetsByCompany);
    this.chart.update();
    }
  }

  private crearCanvasYDiv() {
   //Crear el elemento div    
   const div = this.renderer.createElement('div');
   // Establecer las propiedad del div que se necesiten
   this.renderer.setStyle(div, 'width', '100%');
   this.renderer.setStyle(div, 'height', '400px');
   this.renderer.setStyle(div, 'margin', 'auto');
   this.renderer.setStyle(div, 'text-align', 'center');
 
   // Añadir el atributo id al div
   this.renderer.setAttribute(div, 'id', 'container'+this.tipoChartSelected + this.numeroChart +'PieChart');
 
   // Crear el elemento canvas
   const canvas = this.renderer.createElement('canvas');
   //Añadir atributo id al canvas
   this.renderer.setAttribute(canvas, 'id', this.tipoChartSelected + this.numeroChart +'PieChart');
 
   // Agregar el canvas al div
   this.renderer.appendChild(div, canvas);
   // Agregar el div al elemento actual del componente
   this.renderer.appendChild(this.el.nativeElement, div);
  }
}