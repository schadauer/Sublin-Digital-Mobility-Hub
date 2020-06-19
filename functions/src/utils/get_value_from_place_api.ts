

// Todo: at the moment there is only a string being returned. If the value is an array the first value will be used
export function getValueFromPlaceApi(addressGooglePlaceData: object, objectKey: string, searchKey: string = ''): string {
    if (objectKey !== 'address_components') {
        return (typeof addressGooglePlaceData[objectKey]) === 'string' ? addressGooglePlaceData[objectKey] : '';
    } else {
        for (const element of addressGooglePlaceData['address_components']) {
            for (const [key, val] of Object.entries(element)) {
                if (key === 'types' && Array.isArray(val)) {
                    for (const field of val) {
                        if (field === searchKey) {
                            return element['long_name'] || '';
                        }
                    }
                }
            }
        };
    }
    return '';
}