import { Player } from '../player';
import { Alliance } from '../alliance';

export interface ApiResponse<T> {
    success: boolean;
    count: number;
    results: T;
    form: Object;
}
