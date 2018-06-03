export namespace UtilTypes {
    export interface Newable<T> {
        new(...args: any[]): T;
    }
    export type Factory<T> = (...args: any[]) => (((...args: any[]) => T) | T);
    export type Partial<T> = {
        [P in keyof T]?: T[P];
    };
    export type Maybe<T> = T | null;
}
