import { getPartOfFormattedAddress } from "../utils/get_part_of_formatted_address";

import { CITY } from '../types/delimiter';

export function isPubliclyAccessible(address: string): boolean {
    return excludedCities.find(element => element === getPartOfFormattedAddress(address, CITY)) === undefined ? false : true;
}

const excludedCities: Array<String> = [
    'Wien',
    'Linz',
    'Salzburg',
    'Innsbruck',
    'Graz'
]