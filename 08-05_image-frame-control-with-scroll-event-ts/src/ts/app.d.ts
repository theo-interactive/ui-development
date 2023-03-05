declare global {
    interface Math {
        lerp(start: number, end: number, ratio: number): number;
    }
}
export {}
