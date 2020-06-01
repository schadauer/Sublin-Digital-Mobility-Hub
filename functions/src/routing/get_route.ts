import axios from 'axios';

const DIRECTIONS_KEY = 'AIzaSyDQWaWX46aum25L-o5VSjT6R5dVLFbdgS8';

export async function getSteps(start: String, end: String, mode: String): Promise<any> {
    const address = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
            origin: `place_id:${start}`,
            destination: `place_id:${end}`,
            //mode: mode,
            transit_mode: mode === 'transit' ? 'train|tram|subway' : '',
            language: 'de',
            key: DIRECTIONS_KEY
        }
    })



    return address.data.routes[0];
}