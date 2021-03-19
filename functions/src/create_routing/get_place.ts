import * as functions from 'firebase-functions';
import axios from 'axios';
const config = functions.config();

const PLACE_KEY = config.sublin.google_places_api;

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

