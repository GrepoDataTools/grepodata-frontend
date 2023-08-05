import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TableBodyComponent } from "./components/table-body/table-body.component";
import { TableFooterComponent } from "./components/table-footer/table-footer.component";
import { TableHeaderComponent } from "./components/table-header/table-header.component";
import { TableComponent } from "./components/table/table.component";

@NgModule({
    imports: [CommonModule],
    declarations: [TableComponent, TableHeaderComponent, TableBodyComponent, TableFooterComponent],
    exports: [TableComponent, TableHeaderComponent, TableBodyComponent, TableFooterComponent],
    providers: []
})
export class TableModule {}