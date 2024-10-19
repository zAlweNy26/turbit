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

/**
 * Creates a Turbit instance for high-speed multicore computing.
 */
declare function Turbit(): {
    /**
     * Executes a given function across multiple cores for parallel processing, with the level of parallelism based
     * on the specified execution type and power percentage.
     *
     * @param func The function to be executed. This function should be capable of operating on the provided data, if applicable.
     * @param options The options for execution.
     * @param options.type The type of execution: "simple" for execution with a default level of parallel processing,
     * or "extended" for customized parallel processing across multiple CPU cores.
     * @param options.data The data to be processed. Required for the "extended" type execution to distribute data across processes.
     * @param options.args The arguments to be passed to the function. Optional for the "extended" type execution to provide
     * extra arguments to the function.
     * @param options.power The processing power to use, as a percentage of total available CPU cores. Determines the number
     * of child processes spawned for both "simple" and "extended" type execution. Default to 70%.
     * @returns The result of the execution, including any data processed and statistics about the execution, such as time
     * taken and memory used.
     *
     * For "simple" type:
     * - Executes the function across multiple processes, using a default level of parallel processing determined
     * by the `power` option.
     * - The `data` option is ignored for this type, assuming the function does not require input data or processes static data.
     *
     * For "extended" type:
     * - Distributes the provided `data` across multiple processes for parallel processing, with the degree of parallelism
     * customized through the `power` option.
     * - The `data` option must be an array of items, which will be processed in chunks across the spawned processes.
     *
     * @example
     * // Example usage for simple execution with parallel processing
     * function simpleTask() {
     *   // This example function performs a simple operation
     *   return "Simple task completed";
     * }
     *
     * turbit.run(simpleTask, { type: "simple", power: 100 })
     *   .then(result => console.log("Simple execution result:", result))
     *   .catch(error => console.error("Error in simple execution:", error));
     *
     * // Example usage for extended execution with customized parallel processing
     * function exampleFunction(item) {
     *   // This example function doubles the input
     *   return item * 2;
     * }
     *
     * turbit.run(exampleFunction, {
     *   type: "extended",
     *   data: [1, 2, 3, 4], // Data to be processed in parallel
     *   power: 75 // Use 75% of available CPU cores for enhanced parallel processing
     * })
     *   .then(result => console.log("Extended execution results:", result.data))
     *   .catch(error => console.error("Error in extended execution:", error));
     *
     * @throws If the `func` is not a function or if required parameters for the chosen
     * execution type are not provided or are invalid.
     */
    run: <F extends (...args: any[]) => any>(func: F, options: RunOptions<Parameters<F>>) => Promise<{
        data: Awaited<ReturnType<F>>[];
        stats: {
            timeTakenSeconds: number;
            numProcessesUsed: number;
            dataProcessed: number;
            memoryUsed: string;
        }
    }>;
    /**
     * Terminates all active child processes to ensure a clean shutdown and free system resources.
     * This method is crucial for preventing resource leaks and ensuring that the system remains stable
     * and responsive after the completion of parallel tasks. It should be invoked when all parallel
     * processing tasks are completed, or when the Turbit instance is no longer needed.
     */
    kill: () => void;
};

export = Turbit;