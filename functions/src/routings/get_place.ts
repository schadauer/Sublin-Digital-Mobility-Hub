import axios from 'axios';

const PLACE_KEY = 'AIzaSyDIq5WwJZUG-b_UKlOGaLl4532A9XxY8Lw';

interface PlaceData {
    html_attributions: [];
    result: Object;
    status: String;
}

export async function getPlace(id: String): Promise<object> {
    try {
        const response = await axios.get<Promise<PlaceData>>(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${PLACE_KEY}`);
        return (await response.data).result;
    } catch (e) {
        console.log(e);
        return {};
    }
}

