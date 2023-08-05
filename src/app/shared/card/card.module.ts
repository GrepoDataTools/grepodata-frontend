import { NgModule } from "@angular/core";
import { CardBodyComponent } from "./components/card-body/card-body.component";
import { CardHeaderComponent } from "./components/card-header/card-header.component";
import { CardComponent } from "./components/card/card.component";

@NgModule({
    declarations: [CardComponent, CardHeaderComponent, CardBodyComponent],
    exports: [CardComponent, CardHeaderComponent, CardBodyComponent],
    imports: [],
    providers: []
})
export class CardModule {}