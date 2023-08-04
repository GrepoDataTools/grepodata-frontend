import { Component, Input } from '@angular/core';
import { UnitService } from '../../services/unit.service';

@Component({
    selector: 'unit',
    templateUrl: './unit-detail.component.html',
    styleUrls: ['./unit-detail.component.scss'],
})
export class UnitDetailComponent {
    @Input({
        required: true,
    })
    id!: string;

    @Input() totalCount?: number;
    @Input() wounded?: number;
    @Input() size?: number = 90;

    name: string;

    constructor(private readonly unitService: UnitService) {}

    ngOnInit() {
        this.name = this.unitService.getUnitNameById(this.id);
    }
}
