import { origin, TransportJSON } from 'multi-routing-api';

const mainResource = origin({
  baseUrl: 'https://swapi.co/api/',
  transport: new TransportJSON(),
});

const peopleResource = mainResource.resource('/people/');

export const getPeople = peopleResource.request('GET');

export const getPeopleRequest = params => getPeople(params);
