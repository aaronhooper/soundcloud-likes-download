import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScRestService {

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

    const data = [];

    for (;;) {
      const response: any = await this.http.get(target, { params })
        .toPromise();
      data.push(response);
      if (!response.next_href) { break; }
      target = response.next_href;
    }

    const combined = data.reduce((all, item) => all.concat(item.collection), []);
    return combined;
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

  private createFavoritesUrl(url: string) {
    return url + '/favorites';
  }
}
