import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UnitDetailComponent } from "./components/detail/unit-detail.component";
import { UnitService } from "./services/unit.service";

@NgModule({
    imports: [MatTooltipModule, CommonModule],
    declarations: [UnitDetailComponent],
    exports: [UnitDetailComponent],
    providers: [UnitService]
})
export class UnitModule {}