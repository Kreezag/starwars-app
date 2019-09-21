import origin from '../origin';

const peopleResource = origin.resource('/people');

const mkPeopleIdResource = peopleId =>
  peopleResource.subResource(`/${peopleId}`);

export default peopleResource;
export { mkPeopleIdResource };
