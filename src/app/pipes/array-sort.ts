import { Pipe } from "angular2/core";

@Pipe({
    name: "arraySort"
})
export class ArraySortPipe {

    transform(array: Array<string>, args: string): Array<string> {

        if (typeof args[0] === 'undefined') {
            return array;
        }

        let direction = args[0][0];
        let column = args[0].slice(1);

        console.log(direction, column);

        array.sort((a: any, b: any) => {

            let left = a[column];
            let right = b[column];
            let result = 0;

            if (left < right) {
                result = -1;
            }
            else if (left > right) {
                result = 1;
            }

            return result * (direction === '-' ? -1 : 1);
        });

        return array;
    }
}