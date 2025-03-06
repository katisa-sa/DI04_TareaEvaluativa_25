import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: false
})
export class BarChartComponent  implements OnInit {

  public chart!: Chart;
  
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];
  @Input() nombresCategorias: string[] = [];
  @Input() datosCategorias: number[] = [];
  @Input() tipoChartSelected: string = "";
  

  constructor(public renderer: Renderer2, public el: ElementRef, public gestionServiceApi: GestionApiService ) { }

  ngOnInit() {  
    console.log("Ejecuta bar-chart")
    this.inicializarChart();

     //Nos suscribimos al observable de tipo BehaviorSubject y cuando este emita un valor, recibiremos una notificación con el nuevo valor.
     this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        //Cuando recibimos un valor actualizamos los arrays de nombre y valor de categorias, para guardar el nombre y su valor en las mismas posiciones del array.
        this.nombresCategorias.push(datos.categoria);
        this.datosCategorias.push(datos.totalResults);
        //Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
        this.chart.update();
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

    if (!this.chart) { 
      // Creamos la gráfica (canvas)
      const canvas = this.renderer.createElement('canvas');
      //Le añadimos una id al canvas
      this.renderer.setAttribute(canvas, 'id', 'bar-chart');
    
      // Añadimos el canvas al div con id "contenedor-barchart"
      const container = this.el.nativeElement.querySelector('#contenedor-barchart');
      //Añadimos el canvas al container
      this.renderer.appendChild(container, canvas);

      this.chart = new Chart(canvas, {
        type: 'bar' as ChartType,
        data: {
          labels: [],
          datasets: datasetsByCompany
        },
        options: {
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
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
            }
          },
        }
      });
    } 
    //Importante añadirle el ancho y alto al canvas
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  

  //Crear el elemento div    
  const div = this.renderer.createElement('div');
  // Establecer las propiedad del div que se necesiten
  this.renderer.setStyle(div, 'width', '100%');
  this.renderer.setStyle(div, 'height', '100%');
  this.renderer.setStyle(div, 'margin', 'auto');
  this.renderer.setStyle(div, 'text-align', 'center');

  // Añadir el atributo id al div
  this.renderer.setAttribute(div, 'id', 'container'+this.tipoChartSelected+'BarChart');

  // Crear el elemento canvas
  const canvas = this.renderer.createElement('canvas');
  //Añadir atributo id al canvas
  this.renderer.setAttribute(canvas, 'id', this.tipoChartSelected+'BarChart');

  // Agregar el canvas al div
  this.renderer.appendChild(div, canvas);
  // Agregar el div al elemento actual del componente
  this.renderer.appendChild(this.el.nativeElement, div);
  
  }
}
