import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import './PageCharacters.less';



const DEFAULT_COUNT_REQUEST_ITEMS = 10;


const PageCharactersPagination = ({ currentPageNum = 1, pagesCount = 1, onPageClick = () => {} }) => {
  const pageNumbers = new Array(pagesCount).fill(0).map((_, index) => index + 1, );

  return (
    <Pagination>
      {pageNumbers.map((value) => (
        <Pagination.Item key={value} active={value === currentPageNum} onClick={onPageClick(value)}>{value}</Pagination.Item>
      ))}
    </Pagination>
  )
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

  const pageCounts = paginationPageCounts(request.totalCount);
  const setPaginationPage = (page) => () => setCurrentPage(page);

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
            {pageCounts
              ? (
                <PageCharactersPagination currentPageNum={currentPage} pagesCount={pageCounts} onPageClick={setPaginationPage}/>
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




function paginationPageCounts (totalCounts = 0) {
  if (!totalCounts) {
    return 0;
  }

  return Math.ceil(totalCounts/DEFAULT_COUNT_REQUEST_ITEMS);
};




function getIdFromUrl (swapiUrlString) {
  const result = swapiUrlString.match('/(?:\\D*\/)(\\d*)/');

  return result[1];
};


export default PageCharacters;
