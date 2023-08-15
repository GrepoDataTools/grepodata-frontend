import { Component, Input } from "@angular/core";

@Component({
    selector: 'scoreboard-player-cities-table',
    templateUrl: './player-cities-table.component.html',
    styleUrls: ['./player-cities-table.component.scss'],
    host: {
        class: 'col-6 row'
    }
})
export class PlayerCitiesTableComponent {
    @Input() world: string 

    @Input({ transform: (value: any[]) =>  value.slice(0, 12)}) cityConquestStatistics: any[] = []
    @Input({ transform: (value: any[]) =>  value.slice(0, 12)}) cityLossStatistics: any[] = []

    @Input() isLoading: boolean = false

    

    formatScore(score: number) {
        return new Intl.NumberFormat('en-Gb').format(score)
    }
}