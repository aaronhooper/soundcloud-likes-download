import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScRestService } from '../sc-rest.service';
import { createCSV, createBlob } from './util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText: string;
  json: Promise<any>;
  key: Promise<string>;
  blobUrl: string;
  trustedBlob: any;

  filename = 'likes';
  options: string[] = ['json', 'csv'];
  selected: string = this.options[0];

  constructor(private sc: ScRestService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.key = this.sc.getKey();
  }

  async clickHandle() {
    await this.getFavorites();
    this.attachTrustedBlobUrl();
  }

  async getFavorites() {
    const key = await this.key;
    const resolved = await this.sc.resolve(this.searchText, key);
    this.json = this.sc.getAllFavorites(resolved, key);
  }

  private async attachTrustedBlobUrl() {
    const json = await this.json;
    let blob: any;

    if (this.selected === 'json') {
      const jsonString = JSON.stringify(json);
      blob = createBlob(jsonString, 'json');
    }
    else if (this.selected === 'csv') {
      const csv = createCSV(json);
      blob = createBlob(csv, 'csv');
    }

    this.blobUrl = window.URL.createObjectURL(blob);
    this.trustedBlob = this.sanitizer.bypassSecurityTrustUrl(this.blobUrl);
  }
}
