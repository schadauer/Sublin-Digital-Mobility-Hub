import { getValueFromPlaceApi } from '../utils/get_value_from_place_api';

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

    const data: AddressDetails = {
        postcode: getValueFromPlaceApi(addressGooglePlaceData, 'address_components', 'postal_code') || '',
        street: getValueFromPlaceApi(addressGooglePlaceData, 'name') || '',
        city: getValueFromPlaceApi(addressGooglePlaceData, 'address_components', 'locality') || '',
        district: getValueFromPlaceApi(addressGooglePlaceData, 'address_components', 'administrative_area_level_2') || '',
        state: getValueFromPlaceApi(addressGooglePlaceData, 'address_components', 'administrative_area_level_1') || '',
        country: getValueFromPlaceApi(addressGooglePlaceData, 'address_components', 'country') || '',
        place_id: getValueFromPlaceApi(addressGooglePlaceData, 'place_id') || '',
        formattedAddress: getValueFromPlaceApi(addressGooglePlaceData, 'formatted_address') || ''
    };

    return data;
}