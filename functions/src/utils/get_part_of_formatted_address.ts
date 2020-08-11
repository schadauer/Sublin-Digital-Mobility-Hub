import { getNextDelimiter } from '../utils/get_next_delimiter';

export function getPartOfFormattedAddress(formattedAddress: string, delimiter: string): string {
    if (formattedAddress.indexOf(delimiter) == -1)
        return '';
    const indexStart = formattedAddress.indexOf(delimiter) + delimiter.length;
    const indexEndCheck = formattedAddress.indexOf(getNextDelimiter(delimiter));
    const indexEnd = indexEndCheck === 0 ? formattedAddress.length : indexEndCheck;
    return formattedAddress.substring(indexStart, indexEnd);
}