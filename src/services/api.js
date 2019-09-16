import { origin, TransportJSON } from 'multi-routing-api';

const mainResource = origin({
  baseUrl: 'https://swapi.co/api/',
  transport: new TransportJSON(),
});

const peopleResource = mainResource.resource('/people');
const getPeople = peopleResource.request('GET');
const getPeopleRequest = (params) => getPeople(params);

const peopleIdResource = peopleId => peopleResource.subResource(`/${peopleId}`);
const getPeopleId = (peopleId) => peopleIdResource(peopleId).request('GET');
const getPeopleIdRequest = (peopleId, params) =>
  getPeopleId(peopleId)(params);


export { getPeopleRequest, getPeopleIdRequest };

