export function compareDates(date1: Date, date2: Date): number {
    // Copy both dates just in case they're changed during calculation.
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (d1.getTime() === d2.getTime()) {
        return 0;
    }
    return d1 > d2 ? 1 : -1;
}
