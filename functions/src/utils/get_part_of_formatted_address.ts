import { getNextDelimiter } from '../utils/get_next_delimiter';

export function getPartOfFormattedAddress(formattedAddress: string, delimiter: string): string {
    if (formattedAddress) {
        if (formattedAddress.indexOf(delimiter) === -1)
            return '';
        const indexStart = formattedAddress.indexOf(delimiter) + delimiter.length;
        let indexEndCheck: number;
        if (getNextDelimiter(delimiter, formattedAddress) !== '') {
            indexEndCheck = formattedAddress.indexOf(getNextDelimiter(delimiter, formattedAddress));
        } else {
            indexEndCheck = formattedAddress.length;
        }
        const indexEnd = indexEndCheck === 0 ? formattedAddress.length : indexEndCheck;
        return formattedAddress.substring(indexStart, indexEnd);
    } else return '';
}