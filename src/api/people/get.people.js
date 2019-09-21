import resource from './people';



const getPeople = resource.request('GET');




export default (params) => getPeople(params);
