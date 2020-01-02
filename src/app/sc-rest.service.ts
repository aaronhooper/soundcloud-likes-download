import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScRestService {

  private url = 'https://jsonplaceholder.typicode.com/posts';
  private keyPath = 'assets/api-key.txt';
  private base = 'http://api.soundcloud.com';
  private resolveUrl = this.base + '/resolve';

  constructor(private http: HttpClient) { }

  async getAllFavorites(profileUrl: string, key: string) {
    let target = this.createFavoritesUrl(profileUrl);
    const params = new HttpParams()
      .set('limit', '200')
      .set('linked_partitioning', '1')
      .set('client_id', key);

    let data = [];

    for (;;) {
      const response: any = await this.http.get(target, { params })
        .toPromise();
      data.push(response);
      if (!response.next_href) break;
      target = response.next_href;
    }

    const combined = data.reduce((all, item) => all.concat(item.collection), []);
    const formatted = JSON.stringify(combined);
    return formatted;
  }

  async getFavorites(url: string, key: string) {
    const target = this.createFavoritesUrl(url);
    const params = new HttpParams()
      .set('limit', '200')
      .set('linked_partitioning', '1')
      .set('client_id', key);
    
    const response = await this.http.get(target, { params })
      .toPromise();
    return JSON.stringify(response);
  }

  async resolve(url: string, key: string) {
    const params = new HttpParams()
      .set('url', url)
      .set('client_id', key);

    const json: any = await this.http.get(this.resolveUrl, { params })
      .toPromise();
    return json.uri;
  }

  async getKey() {
    const response = await this.http.get(this.keyPath, { responseType: 'text' })
      .toPromise();
    return response.trim();
  }

  createFavoritesUrl(url: string) {
    return url + '/favorites';
  }
}
