export const distinct = (arr: Array<any>, key: string) => arr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos;
});