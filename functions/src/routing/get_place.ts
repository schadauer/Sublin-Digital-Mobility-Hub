import axios from 'axios';

const PLACE_KEY = 'AIzaSyD1z9jbHsjvvd2PZIuiM56of2Go0AA6Lkc';

interface PlaceData {
    html_attributions: [];
    result: Object;
    status: String;
}

export async function getPlace(id: String): Promise<any> {
    try {
        let response = await axios.get<Promise<PlaceData>>(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=address_components&key=${PLACE_KEY}`);
        return (await response.data).result;
    } catch (e) {
        console.log(e);
        return null;
    }
}

