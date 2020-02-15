export interface Player {
    id: number;
    score: number;
    world: string;
    server: string;
    name: string;
    alliance_id: number;
    alliance_name: string;
    rank: number;
    points: number;
    towns: number;
    att: number;
    def: number;
    active: boolean;
    grep_id: number;
    att_old: number;
    def_old: number;
    fight_rank: number;
    att_rank_max: number;
    def_rank_max: number;
    fight_rank_max: number;
    att_rank_date: Date;
    def_rank_date: Date;
    fight_rank_date: Date;
    heatmap: {
        hour: Object
        day: Object
    }
}