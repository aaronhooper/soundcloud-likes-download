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
  key: Promise<string>;
  blobUrl: string;
  trustedBlob: any;

  filename = 'likes.json';

  constructor(private sc: ScRestService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.key = this.sc.getKey();
  }

  async createDownloadLink() {
    await this.getFavorites();
    this.createTrustedBlobUrl();
  }

  async getFavorites() {
    const key = await this.key;
    const resolved = await this.sc.resolve(this.searchText, key);
    this.json = await this.sc.getAllFavorites(resolved, key);
  }

  private createTrustedBlobUrl() {
    const blob = new Blob([JSON.stringify(this.json)], { type: 'text/json' });
    this.blobUrl = window.URL.createObjectURL(blob);
    this.trustedBlob = this.sanitizer.bypassSecurityTrustUrl(this.blobUrl);
  }
}
