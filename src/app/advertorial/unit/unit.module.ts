import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitComponent } from './unit.component';

@NgModule({
    declarations: [UnitComponent],
    imports: [CommonModule],
    exports: [UnitComponent],
})
export class UnitModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: UnitModule,
            providers: [],
        };
    }
}
