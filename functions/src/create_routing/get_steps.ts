import axios from 'axios';

const DIRECTIONS_KEY = 'AIzaSyDIq5WwJZUG-b_UKlOGaLl4532A9XxY8Lw';

export async function getSteps(
    startAddress: string,
    endAddress: string,
    mode: string,
    startTime: number = Date.now(),
    endTime: number | null = 0,
    provider: object,
    userName: string,
): Promise<any> {
    const route = new Array;
    try {
        const address = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: startAddress,
                destination: endAddress,
                mode: mode,
                departure_time: startTime,
                language: 'de',
                key: DIRECTIONS_KEY
            }
        })

        if (mode === 'transit' && address.data) {
            // address.data.routes[0]['legs'][0]['steps'].map((value: any) => {
            for (var i = 0; i < address.data.routes[0]['legs'][0]['steps'].length; i++) {
                const value = address.data.routes[0]['legs'][0]['steps'];
                if (value[i]['transit_details'] /*&& value['travel_mode'] !== 'WALKING'*/) {
                    route.push({
                        startAddress: value[i]['transit_details']['departure_stop']['name'] ?? '',
                        endAddress: value[i]['transit_details']['arrival_stop']['name'] ?? '',
                        startTime: value[i]['transit_details']['departure_time']['value'] ?? '',
                        endTime: value[i]['transit_details']['arrival_time']['value'] ?? '',
                        providerName: value[i]['transit_details']['line']['agencies'][0]['name'] ?? '',
                        lineName: value[i]['transit_details']['line']['short_name'] ?? '',
                        travelMode: value[i]['travel_mode'] ?? '',
                        // lineName: value['transit_details']['line']['short_name'] !== 'undefined' ? value['transit_details']['line']['short_name'] : '',
                    });
                }
                else {
                    // If this is the beginning of the route
                    if (i == 0) {
                        route.push({
                            startAddress: address.data.routes[0]['legs'][0]['start_address'] ?? '',
                            endAddress: value[i + 1]['transit_details']['departure_stop']['name'] ?? '',
                            startTime: address.data.routes[0]['legs'][0]['departure_time']['value'] ?? '',
                            endTime: value[i + 1]['transit_details']['arrival_time']['value'] ?? '',
                            providerName: '',
                            lineName: '',
                            distance: value[i]['distance']['value'] ?? '',
                            duration: value[i]['duration']['value'] ?? '',
                            travelMode: value[i]['travel_mode'] ?? '',
                        });
                    } else {
                        route.push({
                            endAddress: address.data.routes[0]['legs'][0]['end_address'] ?? '',
                            startAddress: value[i - 1]['transit_details']['arrival_stop']['name'] ?? '',
                            endTime: address.data.routes[0]['legs'][0]['arrival_time']['value'] ?? '',
                            startTime: value[i - 1]['transit_details']['departure_time']['value'] ?? '',
                            providerName: '',
                            lineName: '',
                            distance: value[i]['distance']['value'] ?? '',
                            duration: value[i]['duration']['value'] ?? '',
                            travelMode: value[i]['travel_mode'] ?? '',
                        });
                    }
                }

            }
        } else if (mode === 'driving' && address.data) {
            route.push({
                confirmed: false,
                completed: false,
                noShow: false,
                noShowTime: null,
                confirmedTime: null,
                bookedTime: null,
                completedTime: null,
                // startAddress: address.data.routes[0]['legs'][0]['start_address'],
                // endAddress: address.data.routes[0]['legs'][0]['end_address'],
                startAddress: startAddress,
                endAddress: endAddress,
                duration: address.data.routes[0]['legs'][0]['duration']['value'] ?? '',
                distance: address.data.routes[0]['legs'][0]['distance']['value'] ?? '',
                startTime: startTime,
                endTime: endTime + address.data.routes[0]['legs'][0]['duration']['value'],
                userName,
                provider,
                sponsor: provider['sponsor'] ?? null,
            })
        }
        return route;
    } catch (e) {
        console.log(e);
        return null;
    }
}