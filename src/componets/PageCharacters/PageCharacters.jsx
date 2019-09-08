import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import './PageCharacters.less';



const getId = (swapiUrlString) => {
  const result = swapiUrlString.match('/(?:\\D*\/)(\\d*)/');

  return result[1];
};


const createRequest = async (page) => {
  const request = new Request(`https://swapi.co/api/people/${page ? `?&page=${JSON.stringify(page)}`: ''}`, { method: 'GET' });

  return fetch(request)
    .then((response) => response.json())
    .then((result) => ({
      count: result.count,
      items: result.results
    }))
};






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
                <Button variant="link" onClick={onClickId(getId(item.url))} size="sm">More information</Button>
              </td>
            </tr>
          ))}
        </tbody>
      ) : null}
    </Table>
  )
};



const PageCharacters = () => {
  const [request, setRequestData] = useState({ count: 0, items: [] });
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
            <Pagination>
              <Pagination.First/>
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Last/>
            </Pagination>
          </div>
        </React.Fragment>
      ) : 'Loading'}
    </div>
  )
};


export default PageCharacters;
