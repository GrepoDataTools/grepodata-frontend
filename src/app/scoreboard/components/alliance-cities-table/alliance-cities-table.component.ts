import { Component, Input } from "@angular/core";

@Component({
    selector: 'scoreboard-alliance-cities-table',
    templateUrl: './alliance-cities-table.component.html',
    styleUrls: ['./alliance-cities-table.component.scss'],
    host: {
        class: 'col-6 row'
    }
})
export class AllianceCitiesTableComponent {
    @Input() world: string 

    @Input({ transform: (value: any[]) =>  value.slice(0, 12)}) cityConquestStatistics: any[] = []
    @Input({ transform: (value: any[]) =>  value.slice(0, 12)}) cityLossStatistics: any[] = []

    @Input() isLoading: boolean = false

    

    formatScore(score: number) {
        return new Intl.NumberFormat('en-Gb').format(score)
    }
}