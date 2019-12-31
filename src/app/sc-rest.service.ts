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

  getJson(): Observable<any> {
    return this.http.get(this.url);
  }

  getFavorites(url: string, key: string) {
    const target = this.createFavoritesUrl(url);
    const params = new HttpParams()
      .set('limit', '200')
      .set('linked_partitioning', '1')
      .set('client_id', key);

    return this.http.get(target, { params }).toPromise();
  }

  createFavoritesUrl(url: string) {
    return url + '/favorites';
  }

  async resolve(url: string, key: string) {
    const params = new HttpParams()
      .set('url', url)
      .set('client_id', key);

    const json = await this.http.get(this.resolveUrl, { params })
      .toPromise();
    return json.uri;
  }

  getKey() {
    return this.http.get(this.keyPath, { responseType: 'text' })
      .toPromise()
      .then(text => text.trim());
  }
}
