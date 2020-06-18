import { getAddressComponentsValues } from '../utils/get_address_components_values';

export interface AddressDetails {
    postcode: string,
    street: string,
    city: string,
    district: string,
    state: string,
    country: string,
    place_id: string,
    formattedAddress: string
}

export function getAddressDetails(addressGooglePlaceData: google.maps.Place): AddressDetails {

    let data: AddressDetails = {
        postcode: getAddressComponentsValues(addressGooglePlaceData, 'address_components', 'postal_code') || '',
        street: getAddressComponentsValues(addressGooglePlaceData, 'name') || '',
        city: getAddressComponentsValues(addressGooglePlaceData, 'address_components', 'locality') || '',
        district: getAddressComponentsValues(addressGooglePlaceData, 'address_components', 'administrative_area_level_2') || '',
        state: getAddressComponentsValues(addressGooglePlaceData, 'address_components', 'administrative_area_level_1') || '',
        country: getAddressComponentsValues(addressGooglePlaceData, 'address_components', 'country') || '',
        place_id: getAddressComponentsValues(addressGooglePlaceData, 'place_id') || '',
        formattedAddress: getAddressComponentsValues(addressGooglePlaceData, 'formatted_address') || ''
    };

    return data;
}