import { mkPeopleIdResource } from './people';


const getPeopleId = (peopleId) => mkPeopleIdResource(peopleId).request('GET');


export default (peopleId, params) =>
  getPeopleId(peopleId)(params);
