import { STATION } from '../types/delimiter';

export function getStationFormattedAddress(formattedAddress: string): string {
    const indexStart = formattedAddress.indexOf(STATION);
    return formattedAddress.substring(indexStart, formattedAddress.length);
}