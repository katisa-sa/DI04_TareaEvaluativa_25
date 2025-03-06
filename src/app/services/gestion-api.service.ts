import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INoticia } from '../interfaces/interface';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GestionApiService {

  apiKey: string = environment.apiKey;

  constructor(public leerArticulosServicioHttp: HttpClient) { }

  private datosSubject: BehaviorSubject<{ categoria: string; totalResults: number }|undefined> = 
  new BehaviorSubject<{ categoria: string; totalResults: number }|undefined>(undefined);

  public datos$: Observable<{ categoria: string; totalResults: number }|undefined> = 
  this.datosSubject.asObservable();
  
  public cargarCategoria(categoria: string) {
    //Realizamos la llamada api y la recogemos en un observable de tipo INoticia
    let respuesta: Observable<INoticia> = this.leerArticulosServicioHttp.get<INoticia>("https://newsapi.org/v2/top-headlines?country=us&category=" + categoria + "&apiKey=" + this.apiKey);
    console.log("respuesta: "+ respuesta);
    //Nos suscribimos a la respuesta
    respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        //Mediante datosSubject.next, avisamos a todos los suscriptores (en este caso datos$) de que hemos recibido un nuevo valor.
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
    });
  }

}
