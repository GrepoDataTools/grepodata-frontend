import { Component, Input } from "@angular/core";

@Component({
    selector: 'scoreboard-alliance-fighter-table',
    templateUrl: './alliance-fighter-table.component.html',
    styleUrls: ['./alliance-fighter-table.component.scss'],
    host: {
        class: 'col-6 row'
    }
})
export class AllianceFighterTableComponent {
    @Input() world: string 

    @Input({ transform: (value: any[]) =>  value.slice(0, 12)}) attackerStatistics: any[] = []
    @Input({ transform: (value: any[]) =>  value.slice(0, 12)}) defenderStatistics: any[] = []

    @Input() isLoading: boolean = false

    

    formatScore(score: number) {
        return new Intl.NumberFormat('en-Gb').format(score)
    }
}