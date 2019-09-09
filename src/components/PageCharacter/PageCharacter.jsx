import React, { useEffect, useState } from 'react';
import './PageCharacter.less';

const PageCharacter = ({ location }) => {
  const peopleId = String(location.pathname)
    .split('/')
    .pop();

  const [extendedPersonalData, setExtendedPersonalData] = useState({});

  useEffect(() => {
    let isSubscribed = true;

    createExtendedPersonalDateRequest(peopleId).then(data => {
      if (isSubscribed) {
        return setExtendedPersonalData(data);
      }

      return null;
    });

    return () => (isSubscribed = false);
  }, [peopleId]);

  return (
    <div className="PageCharacter__head">
      Some Character
      <div>{JSON.stringify(extendedPersonalData)}</div>
    </div>
  );
};

export default PageCharacter;

async function createExtendedPersonalDateRequest(peopleID) {
  let requestUrl = new URL(peopleID, 'https://swapi.co/api/people/');

  return createFetchRequest(requestUrl).then(extendedPersonalData => {
    const {
      films,
      starships,
      species,
      vehicles,
      homeworld,
    } = extendedPersonalData;

    let extendedRequestFields = {};

    extendedRequestFields.homeworld = createFetchRequest(homeworld);
    extendedRequestFields.films = mkFetchRequestOfArrayUrls(films);
    extendedRequestFields.starships = mkFetchRequestOfArrayUrls(starships);
    extendedRequestFields.species = mkFetchRequestOfArrayUrls(species);
    extendedRequestFields.vehicles = mkFetchRequestOfArrayUrls(vehicles);

    const extendedRequestFieldsKeys = Object.keys(extendedRequestFields);

    return Promise.all(
      extendedRequestFieldsKeys.map(key => extendedRequestFieldsKeys[key]),
    )
      .then(results =>
        results.reduce(
          (object, result, index) => ({
            ...object,
            [extendedRequestFieldsKeys[index]]: result,
          }),
          {},
        ),
      )
      .then(additionalextendedPersonalData => ({
        ...extendedPersonalData,
        ...additionalextendedPersonalData,
      }));
  });
}

async function mkFetchRequestOfArrayUrls(arr) {
  if (Array.isArray(arr) && arr.length) {
    const promisesArr = arr.reduce(
      (prev, el) => [...prev, createFetchRequest(el)],
      [],
    );

    return Promise.all(promisesArr);
  }

  return null;
}

async function createFetchRequest(url) {
  return fetch(new Request(url, { method: 'GET' })).then(response =>
    response.json(),
  );
}
