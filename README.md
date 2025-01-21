## Suggestions:
- main.ts:
    1) Use Promise.all
    
    ```bash
   const workersPromises = range(WORKERS_NUMBER).map(i => {
        const worker = new Worker(i, queue);
        return worker.Work(db.set);
    });
    ```
    2) remove the sleep, handle it using promise.all
    ```
      await Promise.all(workersPromises);
    ```
- database.ts:
    1) Use Map, like this:
     ```bash
     Map<string, number>;
    ```
    instead of this:
    ```bash
    { [key: string]: number }
     ```
    2) Combine uuid in order to generate id

- util.ts:
1) use Array.from in range function is more efficent:
```bash
    export function range(n: number): number[] {
        return Array.from({ length: n }, (_, index) => index);
    }
```