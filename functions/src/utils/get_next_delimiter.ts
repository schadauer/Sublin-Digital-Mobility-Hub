import { NUMBER, STREET, CITY, COUNTRY, STATION } from '../types/delimiter';

export function getNextDelimiter(delimiter: string): string {
    var nextDelimiter;
    switch (delimiter) {
        case NUMBER:
            nextDelimiter = STREET;
            break;
        case STREET:
            nextDelimiter = CITY;
            break;
        case CITY:
            nextDelimiter = COUNTRY;
            break;
        case COUNTRY:
            nextDelimiter = STATION
        default:
            return ''
    }
    return nextDelimiter;

}