import { Component, Input } from "@angular/core";

@Component({
    selector: 'tfoot[gd-table-footer]',
    templateUrl: './table-footer.component.html',
    styleUrls: ['./table-footer.component.scss'],
})
export class TableFooterComponent {
    @Input() backgroundColor: string = 'rgb(238, 238, 238)'
}