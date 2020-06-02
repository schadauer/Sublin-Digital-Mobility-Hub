import axios from 'axios';

const DIRECTIONS_KEY = 'AIzaSyDQWaWX46aum25L-o5VSjT6R5dVLFbdgS8';


export async function getSteps(start: String, end: String, mode: String): Promise<any> {
    let route = new Array;
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
        if (mode === 'transit') {
            address.data.routes[0]['legs'][0]['steps'].map((value: any) => {
                if (value['transit_details'] && value['travel_mode'] !== 'WALKING') {
                    route.push({
                        startAddress: value['transit_details']['departure_stop']['name'],
                        endAddress: value['transit_details']['arrival_stop']['name'],
                        startTime: value['transit_details']['departure_time']['value'],
                        endTime: value['transit_details']['arrival_time']['value'],
                        provider: value['transit_details']['line']['short_name']
                    });
                }
            })
        } else if (mode === 'driving') {
            route.push({
                startAddress: address.data.routes[0]['legs'][0]['start_address'],
                endAddress: address.data.routes[0]['legs'][0]['end_address'],
                // startTime: address.data.routes[0]['legs'],
                // endTime:
                // provider: address.data.routes[0]['legs']
            })
        }
        return route;
    } catch (e) {
        console.log(e);
    }

}