import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  public lang: string = 'english';

  constructor() { }

  ngOnInit(): void {
  }

  showContactDialog() {
  //  TODO
    alert("TODO");
  }

}
