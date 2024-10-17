type FirstElement<T extends any[]> = T extends [infer F, ...any[]] ? F : never;

type RestElements<T extends any[]> = T extends [any, ...infer R] ? R : never;

type RunOptions<A extends [keyof any, any][]> = {
    type?: 'simple' | 'extended'
    power?: number
} & ({
    type: 'simple'
} | {
    type: 'extended'
    data: FirstElement<A>[]
    args: RestElements<A>
});

declare function Turbit(): {
    run: <F extends (...args: any[]) => any>(func: F, options: RunOptions<Parameters<F>>) => Promise<{
        data: ReturnType<F>[];
        stats: {
            timeTakenSeconds: number;
            numProcessesUsed: number;
            dataProcessed: number;
            memoryUsed: string;
        }
    }>;
    kill: () => void;
};

export = Turbit;