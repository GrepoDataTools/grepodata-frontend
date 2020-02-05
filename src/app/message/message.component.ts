import {Component, Inject, OnInit} from '@angular/core';
import {CaptchaService} from '../services/captcha.service';
import {MessageService} from '../services/message.service';
import { ViewChild, ElementRef } from '@angular/core';
import {RecaptchaComponent} from 'ng-recaptcha';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageService, CaptchaService, RecaptchaComponent]
})
export class MessageComponent implements OnInit {
  @ViewChild(RecaptchaComponent, {static: false}) captchaRef:RecaptchaComponent;

  contact_message = '';
  contact_name = '';
  contact_mail = '';
  submitted = false;
  loading = false;
  error = '';
  captcha = '';
  recaptcha_key = environment.recaptcha;

  constructor(
    public captchaService : CaptchaService,
    private messageService : MessageService) { }

  resolved(captchaResponse: string) {
    this.captcha = captchaResponse;
    this.sendContactMessage();
  }

  public sendContactMessage() {
    this.loading = true;
    if (this.contact_message == '') {
      this.error = 'Message is required';
      this.loading = false;
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else if (this.captcha == '' || this.captcha == null) {
      this.error = 'Please click the captcha (Not a robot)';
      this.loading = false;
      if (this.captchaRef != undefined) { this.captchaRef.reset(); }
    } else {
      this.messageService.sendMessage(this.contact_message, this.contact_mail, this.contact_name, this.captcha).subscribe(
        (response) => {
          this.submitted = true;
          this.loading = false;
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        },
        (error) => {
          this.error = 'Invalid captcha response. Please try again.';
          this.loading = false;
          if (this.captchaRef != undefined) { this.captchaRef.reset(); }
        }
      );

    }
  }

  ngOnInit(): void {
  }

  //
  // ngOnInit(): void {
  //   console.log('start');
  //   let size = 1000;
  //   let tilesize = 1;
  //   let halftile = 0;
  //   let data = [];
  //   data[0]={x:200,y:200,size:130,c:'yellow'};
  //   data[1]={x:700,y:500,size:100,c:'red'};
  //   data[2]={x:500,y:700,size:100,c:'green'};
  //   data[3]={x:500,y:500,size:30,c:'blue'};
  //   data[4]={x:500,y:705,size:50,c:'cyan'};
  //   this.context = (<HTMLCanvasElement>this.gfx.nativeElement).getContext('2d');
  //   this.context.canvas.width = size;
  //   this.context.canvas.height = size;
  //   this.context.canvas.style.zIndex = '8';
  //   this.context.canvas.style.position = "absolute";
  //   this.context.canvas.style.border = "1px solid";
  //
  //   let max_dist = -1;
  //   for (let alliance of data) {
  //     let alliance_dist = this.calculateDistance([alliance.x, alliance.y], [size/2, size/2]);
  //     if (alliance_dist > max_dist) {
  //       max_dist = alliance_dist + alliance.size;
  //     }
  //   }
  //   console.log('max dist: ' + max_dist);
  //   console.log('max dist: ' + this.calculateDistance([999,999], [size/2, size/2]));
  //
  //   for (let x = 0; x < size; x+=tilesize) {
  //     for (let y = 0; y < size; y+=tilesize) {
  //       let centerX = x+halftile;
  //       let centerY = y+halftile;
  //       let dist = -1;
  //       if (this.calculateDistance([centerX, centerY], [500, 500]) < max_dist) {
  //         for (let alliance of data) {
  //           let alliance_dist = this.calculateDistance([alliance.x, alliance.y], [centerX, centerY]) * (500-alliance.size);
  //           if (dist == -1 || alliance_dist < dist) {
  //             dist = alliance_dist;
  //             this.context.fillStyle = alliance.c;
  //             this.context.fillRect(x, y, x+tilesize, y+tilesize);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   this.context.imageSmoothingEnabled = true;
  //   console.log('done');
  //
  // }
  //
  // calculateDistance = (p: number[], q: number[]) => {
  //   if (p.length != q.length) return -1;
  //   const subtracted = q.map((i, n) => i - p[n]);
  //   const powered = subtracted.map(e => Math.pow(e, 2));
  //   const sum = powered.reduce((total, current) => total + current, 0);
  //   return Math.sqrt(sum);
  // }

}
