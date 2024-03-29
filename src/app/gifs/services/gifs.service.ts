import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'IU45LTfx6utu01o9hq1P7u4t7vW5IGhR';
  private servicoUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    if (localStorage.getItem('historial') !== null) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }
    if (localStorage.getItem('resultados') !== null) {
      this.resultados = JSON.parse(localStorage.getItem('resultados')!);
    }
  }

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', query);
    // console.log(params);

    this.http.get<SearchGifsResponse>(`${this.servicoUrl}/search`, { params })
      .subscribe((response) => {
        // console.log(response.data);
        this.resultados = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      })
  }
}
