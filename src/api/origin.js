import { origin, TransportJSON } from 'multi-routing-api';

export default origin({
  baseUrl: 'https://swapi.co/api/',
  transport: new TransportJSON(),
});
