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

    if (this.selected === 'json') {
      const jsonString = JSON.stringify(await this.json);
      this.attachTrustedBlobUrl(createBlob(jsonString, 'json'));
    }
    else if (this.selected === 'csv') {
      const csv = createCSV(await this.json);
      this.attachTrustedBlobUrl(createBlob(csv, 'csv'));
    }
  }

  async getFavorites() {
    const key = await this.key;
    const resolved = await this.sc.resolve(this.searchText, key);
    this.json = this.sc.getAllFavorites(resolved, key);
  }

  private attachTrustedBlobUrl(blob) {
    const blobUrl = window.URL.createObjectURL(blob);
    this.trustedBlob = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  }
}
