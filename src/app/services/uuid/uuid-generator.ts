import { Injectable } from '@angular/core';

@Injectable()
export class UuidGenerator {
    /**
     * Generate an UUID
     * Based upon http://slavik.meltser.info/the-efficient-way-to-create-guid-uuid-in-javascript-with-explanation/
     */
    generate(): string {

        return _p8() + _p8(true) + _p8(true) + _p8();

        function _p8(s = false): string {
            const p = (`${Math.random().toString(16)}000000000`).substr(2, 8);
            return s ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p;
        }

    }
}
