import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfeedAdComponent } from './infeed-ad.component';
import { SharedModule } from '../shared.module';

@NgModule({
    declarations: [InfeedAdComponent],
    imports: [CommonModule, SharedModule],
    exports: [InfeedAdComponent],
})
export class InfeedAdModule {}
