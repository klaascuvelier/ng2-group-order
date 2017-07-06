import { Injectable } from '@angular/core';

@Injectable()
export class LocationHelper
{
    static getSearchParam (param)
    {
        const searchParams = window.location.search.replace('?', '').split('&').map(searchParam => {
            const parts = searchParam.split('=');
            return {
                param: parts[0],
                value: parts[1]
            };
        });

        searchParams.push({ param, value: null });

        return searchParams.filter(searchParam => searchParam.param === param)[0].value;
    }
}
