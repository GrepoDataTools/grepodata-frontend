import { Component, Input, TemplateRef } from "@angular/core";

@Component({
    selector: 'gd-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent {
    @Input() title?: string | TemplateRef<Element>
}