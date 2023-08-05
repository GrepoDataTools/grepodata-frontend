import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'gd-flag',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
})
export class FlagComponent implements OnInit {

  @Input({ required: true }) country: string = 'gb';

  @Input() width: number = 25;

  @Input() height: number = 25;

  link: string = '';

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    ) {
  }

  ngOnInit(): void {
    this.link = `assets/images/flags/${this.country}.svg`
  }

}