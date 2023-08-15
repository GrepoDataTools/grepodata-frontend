import { Component, Input } from "@angular/core";

@Component({
    selector: 'scoreboard-alliance-changes-table',
    templateUrl: './alliance-changes-table.component.html',
    styleUrls: ['./alliance-changes-table.component.scss'],
    host: {
        class: 'col-12 row'
    }
})
export class AllianceChangesTableComponent {
    @Input() world: string 

    @Input({ transform: (value: any[]) =>  value.slice(0, 12)}) changeStatistics: any[] = []

    @Input() isLoading: boolean = false

    

    formatScore(score: number) {
        return new Intl.NumberFormat('en-Gb').format(score)
    }
}