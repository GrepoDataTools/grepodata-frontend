import { Injectable } from "@angular/core";
import { Units } from "../enums/unit.enum";

@Injectable()
export class UnitService {
    constructor() {
    }

    getUnitNameById(id: string) {
        console.log(id)
        if (id in Units) {
            return Units[id];
        }

        return Units.unknown
    }
}