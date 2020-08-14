import axios from 'axios';

const DIRECTIONS_KEY = 'AIzaSyDIq5WwJZUG-b_UKlOGaLl4532A9XxY8Lw';

export async function getSteps(start: string, end: string, mode: string, sublinStartTime: number = 0, provider: object): Promise<any> {
    const route = new Array;
    try {
        const address = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: start.indexOf(' ') >= 0 ? start : `place_id:${start}`,
                destination: end.indexOf(' ') >= 0 ? end : `place_id:${end}`,
                mode: mode,
                transit_mode: mode === 'transit' ? 'train|tram|subway' : 'driving',
                language: 'de',
                key: DIRECTIONS_KEY
            }
        })
        if (mode === 'transit' && address.data) {
            address.data.routes[0]['legs'][0]['steps'].map((value: any) => {
                if (value['transit_details'] /*&& value['travel_mode'] !== 'WALKING'*/) {
                    route.push({
                        startAddress: value['transit_details']['departure_stop']['name'],
                        endAddress: value['transit_details']['arrival_stop']['name'],
                        startTime: value['transit_details']['departure_time']['value'],
                        endTime: value['transit_details']['arrival_time']['value'],
                        provider: value['transit_details']['line']['agencies'][0]['name']
                    });
                }
            })
        } else if (mode === 'driving' && address.data) {
            route.push({
                confirmed: false,
                startAddress: address.data.routes[0]['legs'][0]['start_address'],
                endAddress: address.data.routes[0]['legs'][0]['end_address'],
                duration: address.data.routes[0]['legs'][0]['duration']['value'],
                distance: address.data.routes[0]['legs'][0]['distance']['value'],
                startTime: sublinStartTime,
                endTime: sublinStartTime + address.data.routes[0]['legs'][0]['duration']['value'] + 300,
                provider,
            })
        }
        return route;
    } catch (e) {
        console.log(e);
        return null;
    }
}