import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScRestService } from '../sc-rest.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { createCSV, createBlob } from './util';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText: string;
  trustedBlob: any;
  private json: Promise<any>;
  private key: Promise<string>;

  options: string[] = ['json', 'csv'];
  selected: string = this.options[0];

  constructor(
    private sc: ScRestService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.key = this.sc.getKey();
  }

  get filename() {
    return 'likes' + '.' + this.selected;
  }

  clickHandle() {
    this.getFavorites()
      .then(() => this.json)
      .then(json => {
        if (this.selected === 'json') {
          const jsonString = JSON.stringify(json);
          this.attachTrustedBlobUrl(createBlob(jsonString, 'json'));
        }
        else if (this.selected === 'csv') {
          const csv = createCSV(json);
          this.attachTrustedBlobUrl(createBlob(csv, 'csv'));
        }
      })
      .catch(err => {
        if (err instanceof HttpErrorResponse) {
          this.openSnackBar("Could not connect. Please try again later.");
        }
        else throw err;
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 5000,
    });
  }

  private async getFavorites() {
    const key = await this.key;
    const resolved = await this.sc.resolve(this.searchText, key);
    this.json = this.sc.getAllFavorites(resolved, key);
  }

  private attachTrustedBlobUrl(blob) {
    const blobUrl = window.URL.createObjectURL(blob);
    this.trustedBlob = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  }
}
