import { getPartOfFormattedAddress } from "../utils/get_part_of_formatted_address";

import { CITY, STATION } from '../types/delimiter';

export function isPubliclyAccessible(address: string): boolean {
    if (address.includes(STATION)) return true
    else
        return excludedCities.find(element => element === getPartOfFormattedAddress(address, CITY)) === undefined ? false : true;
}

const excludedCities: Array<String> = [
    'Wien',
    'Linz',
    'Salzburg',
    'Innsbruck',
    'Graz'
]