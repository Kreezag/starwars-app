import React, { useEffect, useState } from 'react';
import './PageCharacter.less';

const PageCharacter = ({ location, ...params }) => {
  const peopleId = String(location.pathname)
    .split('/')
    .pop();

  const [personalInfo, setPersonalInfo] = useState({});

  useEffect(() => {
    let isSubscribed = true;

    createPersonalInfoRequest(peopleId).then(data => {
      if (isSubscribed) {
        return setPersonalInfo(data);
      }

      return null;
    });

    return () => (isSubscribed = false);
  }, [peopleId]);

  return (
    <div className="PageCharacter__head">
      Some Character
      <div>{JSON.stringify(personalInfo)}</div>
    </div>
  );
};

export default PageCharacter;

async function createPersonalInfoRequest(peopleID) {
  let requestUrl = new URL(peopleID, 'https://swapi.co/api/people/');

  return createFetchRequest(requestUrl).then(personalInfo => {
    const { films, starships, species, vehicles, homeworld } = personalInfo;

    let dataPeopleRequestArr = {};

    dataPeopleRequestArr.homeworld = createFetchRequest(homeworld);
    dataPeopleRequestArr.films = mkRequestOfArrayUrls(films);
    dataPeopleRequestArr.starships = mkRequestOfArrayUrls(starships);
    dataPeopleRequestArr.species = mkRequestOfArrayUrls(species);
    dataPeopleRequestArr.vehicles = mkRequestOfArrayUrls(vehicles);

    const dataPeopleKeys = Object.keys(dataPeopleRequestArr);

    return Promise.all(dataPeopleKeys.map(key => dataPeopleRequestArr[key]))
      .then(results =>
        results.reduce(
          (object, result, index) => ({
            ...object,
            [dataPeopleKeys[index]]: result,
          }),
          {},
        ),
      )
      .then(additionalpersonalInfo => ({
        ...personalInfo,
        ...additionalpersonalInfo,
      }));
  });
}

async function mkRequestOfArrayUrls(arr) {
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
