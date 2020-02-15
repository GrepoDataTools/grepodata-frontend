import { Component, OnInit, Input } from '@angular/core';
import { Icon } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-preview-box',
  templateUrl: './preview-box.component.html',
  styleUrls: ['./preview-box.component.scss']
})
export class PreviewBoxComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  icon: Icon;

  @Input()
  description: string;

  @Input()
  imageUrl: string;

  @Input()
  buttonText: string;

  @Input()
  url: string;

  constructor() { }

  ngOnInit(): void {
  }

}
