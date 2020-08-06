import { getNextDelimiter } from '../utils/get_next_delimiter';

export function getPartOfFormattedAddress(formattedAddress: string, delimiter: string): string {
    const indexStart = formattedAddress.indexOf(delimiter) + delimiter.length;
    const indexEndCheck = formattedAddress.indexOf(getNextDelimiter(delimiter));
    const indexEnd = indexEndCheck == 0 ? formattedAddress.length : indexEndCheck;
    return indexStart != 0 ? formattedAddress.substring(indexStart, indexEnd) : '';
}