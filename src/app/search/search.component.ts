import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  blobUrl: string;
  trustedBlob: any;

  filename = 'likes.json';

  constructor(private sc: ScRestService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.sc.getJson()
      .subscribe(data => this.json = data);

    this.sc.getKey()
      .then(key => this.key = key);
  }

  async getFavorites() {
    const resolved = await this.sc.resolve(this.searchText, this.key);
    this.json = await this.sc.getFavorites(resolved, this.key);
    console.log(this.json);

    this.createTrustedBlobUrl();
  }

  private createTrustedBlobUrl() {
    const blob = new Blob([this.json], { type: 'text/json' });
    this.blobUrl = window.URL.createObjectURL(blob);
    this.trustedBlob = this.sanitizer.bypassSecurityTrustUrl(this.blobUrl);
  }
}
