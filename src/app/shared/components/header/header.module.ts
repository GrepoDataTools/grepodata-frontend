import { NgModule } from "@angular/core";
import { HeaderComponent } from './header.component';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [HeaderComponent],
    exports: [HeaderComponent],
    imports: [
        BrowserModule,
        TranslateModule
    ]
})

export class HeaderModule { }