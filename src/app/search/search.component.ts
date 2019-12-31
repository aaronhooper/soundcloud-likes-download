import { Component, OnInit } from '@angular/core';
import { ScRestService } from '../sc-rest.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText: string;
  json: any;
  key: string;

  constructor(private scRest: ScRestService) { }

  ngOnInit() {
    this.scRest.getJson()
      .subscribe(data => this.json = data);

    this.scRest.getKey()
      .then(key => this.key = key);
  }

  async getFavorites() {
    const resolved = await this.scRest.resolve(this.searchText, this.key);
    this.json = await this.scRest.getFavorites(resolved, this.key);
    console.log(this.json);

    this.downloadFile(this.json);
  }

  downloadFile(data) {
    const blob = new Blob([data], { type: 'text/json' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

}
