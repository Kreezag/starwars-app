import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import './PageCharacters.less';




const PageCharactersTable = ({ items = [], onClickId }) => {
  return (
    <Table striped bordered hover>
      <thead>
      <tr>
        <th>Name</th>
        <th>Birth Year</th>
        <th>Gender</th>
        <th>Height</th>
        <th>Mass</th>
        <th>more</th>
      </tr>
      </thead>
      {items.length ? (
        <tbody>
          {items.map((item) => (
            <tr key={item.url}>
              <td>{item.name}</td>
              <td>{item.birth_year}</td>
              <td>{item.gender}</td>
              <td>{item.height}</td>
              <td>{item.mass}</td>
              <td>
                <Button variant="link" onClick={onClickId(getIdFromUrl(item.url))} size="sm">More information</Button>
              </td>
            </tr>
          ))}
        </tbody>
      ) : null}
    </Table>
  )
};



const PageCharacters = () => {
  const [request, setRequestData] = useState({ totalCount: 0, items: [] });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    createRequest(currentPage)
      .then((data) => {
        return setRequestData(data)
      })
  }, [currentPage]);

  const handleClickId = () => () => {
    setCurrentPage(currentPage + 1); // TODO: for test request
  };

  return (
    <div>
      <div className="PageCharacters__head">
        List of Characters
      </div>
      {request.items.length ? (
        <React.Fragment>
          <div className="PageCharacters__table">
            <PageCharactersTable items={request.items} onClickId={handleClickId}/>
          </div>

          <div className="PageCharacters__pagination">
            {hasPaginationPageCounts(request.totalCount, request.items.length)
              ? (
                <Pagination>
                  <Pagination.First/>
                  <Pagination.Item>{1}</Pagination.Item>
                  <Pagination.Last/>
                </Pagination>
              ) : null}
          </div>
        </React.Fragment>
      ) : 'Loading'}
    </div>
  )
};




async function createRequest (page) {
  const request = new Request(`https://swapi.co/api/people/${page ? `?&page=${JSON.stringify(page)}`: ''}`, { method: 'GET' });

  return fetch(request)
    .then((response) => response.json())
    .then((result) => ({
      totalCount: result.count,
      items: result.results
    }))
};




function hasPaginationPageCounts (totalCounts = 0, pageCounts = 0) {
  if (!totalCounts || !pageCounts) {
    return 0;
  }

  return Math.ceil(totalCounts/pageCounts);
};




function getIdFromUrl (swapiUrlString) {
  const result = swapiUrlString.match('/(?:\\D*\/)(\\d*)/');

  return result[1];
};


export default PageCharacters;
