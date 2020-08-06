import { getPartOfFormattedAddress } from '../utils/get_part_of_formatted_address';
import { COMPANY, NUMBER, STREET, CITY, COUNTRY, STATION } from '../types/delimiter';

export function getAddressesQueryArray(formattedAddress: string): Array<string> {
    var addressesArray = new Array();
    if (getPartOfFormattedAddress(formattedAddress, NUMBER) !== '') {
        addressesArray = [formattedAddress, formattedAddress.substring(0, formattedAddress.indexOf(NUMBER)), formattedAddress.substring(0, formattedAddress.indexOf(STREET))];
    } else if (getPartOfFormattedAddress(formattedAddress, STREET) !== '') {
        addressesArray = [formattedAddress, formattedAddress.substring(0, formattedAddress.indexOf(STREET))];
    } else {
        addressesArray = [formattedAddress];
    }
    return addressesArray;
}