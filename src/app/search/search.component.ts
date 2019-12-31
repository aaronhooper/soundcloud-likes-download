import { Component, OnInit } from '@angular/core';
import { ScRestService } from '../sc-rest.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText: string;
  json: object[];

  constructor(private scRest: ScRestService) { }

  ngOnInit() {
    this.scRest.getJson()
      .subscribe(data => this.json = data);
  }

}
