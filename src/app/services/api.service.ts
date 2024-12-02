import { Injectable } from '@angular/core';


import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  }


  private apiURL = 'https://mindicador.cl/api';

  constructor(private http: HttpClient) { }


  // GET
  getValue(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  // POST
  postValue(newIndicator: any): Observable<any> {
    return of({ success: true, data: newIndicator }).pipe(
      map(response => {
        console.log('Nuevo indicador:', newIndicator);

        return response;
      })
    );
  }

  // PUT
  putValue(updatedIndicator: any): Observable<any> {
    return of({ success: true, data: updatedIndicator }).pipe(
      map(response => {
        console.log('Indicador actualizado:', updatedIndicator);

        return response;
      })
    );
  }

  // DELETE
  deleteValue(indicatorCode: string): Observable<any> {
    return of({ success: true, data: {
      codigo: indicatorCode
    }}).pipe(
      map(response => {
        console.log('Indicador eliminado:', indicatorCode);

        return response;
      })
    );
  }

}
