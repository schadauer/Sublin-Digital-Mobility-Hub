import { NUMBER, STREET, CITY, COUNTRY, COMPANY } from '../types/delimiter';

export function getNextDelimiter(delimiter: string, formattedAddress: string): string {
    let nextDelimiter;
    switch (delimiter) {
        case COUNTRY:
            nextDelimiter = CITY;
            break;
        case CITY:
            if (formattedAddress.indexOf(STREET) !== -1)
                nextDelimiter = STREET;
            else
                nextDelimiter = '';
            break;
        case STREET:
            if (formattedAddress.indexOf(COMPANY) !== -1)
                nextDelimiter = COMPANY;
            else if (formattedAddress.indexOf(NUMBER) !== -1)
                nextDelimiter = NUMBER;
            else
                nextDelimiter = '';
            break;
        default:
            return ''
    }
    // console.log('NextDelimiter');
    // console.log(formattedAddress);
    // console.log(delimiter);
    // console.log(nextDelimiter);
    return nextDelimiter;

}