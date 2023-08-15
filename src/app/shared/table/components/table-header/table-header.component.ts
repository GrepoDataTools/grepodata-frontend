import { Component, Input } from "@angular/core";

@Component({
    selector: 'thead[gd-table-header]',
    templateUrl: './table-header.component.html',
    styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent {
    @Input() backgroundColor: string = 'rgb(238, 238, 238)'
}