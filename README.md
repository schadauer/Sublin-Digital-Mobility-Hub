<p align="center">
<img src="doc/img/sublin-logo-200.png">
</p>

# Sublin Digital Mobility Hub

## Firebase based prototype
The Sublin project started with the development of a Firebase based prototype.
The Sublin prototype is based on Firebase using Firestore. The corresponding prototype app can be found in the repo [https://github.com/schadauer/Sublin]. All functions are Firebase-triggered. [A demo video](https://youtu.be/fUwMlH78LVI) about the user experience of the app for a better understanding about the underlying functionalities is available.

Firebase is only used as an interims solutions and should be replaced by a solution that is not bound to a specific hosting provider. At the moment functions are triggered by database changes. Moving forward functions will be triggered by API calls defined by the [TOMP-API](https://tomp-wg.org/).


## Digital Mobility Hub
General information to the Sublin mobility hub can be found on [www.sublin.dev](https://www.sublin.dev/development). The mobility hub accumulates transport operators and make them available via a single API to MaaS providers or other Sublin mobility hubs.

The Sublin mobility hub consists of the following components:
- The API server in sync with [TOMP-WG](https://tomp-wg.org/)
- API server functions
- Trip manager (TBD)
- GraphQL connector (TBD)
- Authentication and authorization (users are not included) (TBD)

### The API defined by TOMP-WG
The API defines both sides - endpoints for the MP (MaaS-Provider) and the TO (Transport Operators). The OpenApi documentation for the endpoints can be [here](https://app.swaggerhub.com/apis/TOMP-API-WG/transport-operator_maas_provider_api/). The Sublin mobility hubs provides two modes depending on the URL-requests. MPs can either 
- request a service of a specific TO by providing the TO-id after the hub domain ([mobility hub domain]/[TO id]/[endpoint])
- or a full intermodal route by calling the endpoints without the TO-id ([mobility hub domain]/[endpoint]).

<p align="center">
<img src="doc/img/sublin-mobility-hub-overview.png">
</p>

### API functions
The API functions consists of server functions (SF) and client functions (CF). Server functions are callback functions that are triggered by API endpoint calls which can then execute the trip manager and CF to call TO API endpoints from transport operators or other mobility hubs.
<p align="center">
<img src="doc/img/sublin-functions-overview.png">
</p>

### Trip manager

### GraphQL connector

### Authentication and authorization
