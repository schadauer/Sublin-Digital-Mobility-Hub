import { NUMBER, STREET, CITY, COUNTRY } from '../types/delimiter';

export function getNextDelimiter(delimiter: string): string {
    let nextDelimiter;
    switch (delimiter) {
        case COUNTRY:
            nextDelimiter = CITY;
            break;
        case CITY:
            nextDelimiter = STREET;
            break;
        case STREET:
            nextDelimiter = NUMBER;
            break;
        default:
            return ''
    }
    return nextDelimiter;

}