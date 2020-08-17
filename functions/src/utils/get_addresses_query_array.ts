import { getPartOfFormattedAddress } from '../utils/get_part_of_formatted_address';
import { NUMBER, STREET, COMPANY } from '../types/delimiter';

export function getAddressesQueryArray(formattedAddress: string): Array<string> {
    let addressesArray = new Array();
    if (getPartOfFormattedAddress(formattedAddress, COMPANY) !== '') {
        addressesArray = [formattedAddress, formattedAddress.substring(0, formattedAddress.indexOf(COMPANY)), formattedAddress.substring(0, formattedAddress.indexOf(STREET))];
    } else if (getPartOfFormattedAddress(formattedAddress, NUMBER) !== '') {
        addressesArray = [formattedAddress, formattedAddress.substring(0, formattedAddress.indexOf(NUMBER)), formattedAddress.substring(0, formattedAddress.indexOf(STREET))];
    } else if (getPartOfFormattedAddress(formattedAddress, STREET) !== '') {
        addressesArray = [formattedAddress, formattedAddress.substring(0, formattedAddress.indexOf(STREET))];
    } else {
        addressesArray = [formattedAddress];
    }
    return addressesArray;
}