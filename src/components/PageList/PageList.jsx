import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
// import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './PageList.less';



const DEFAULT_COUNT_REQUEST_ITEMS = 10;


const PageListPagination = ({ currentPageNum = 1, pagesCount = 1, onPageClick = () => {} }) => {
  const pageNumbers = new Array(pagesCount).fill(0).map((_, index) => index + 1, );

  return (
    <Pagination>
      {pageNumbers.map((value) => (
        <Pagination.Item key={value} active={value === currentPageNum} onClick={onPageClick(value)}>{value}</Pagination.Item>
      ))}
    </Pagination>
  )
};

const PageListTable = ({ items = [], onClickId }) => {
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
                <Link
                  to={{
                    pathname: `/character/${getIdFromUrl(item.url)}`,
                  }}
                >More information</Link>
              </td>
            </tr>
          ))}
        </tbody>
      ) : null}
    </Table>
  )
};



const PageList = () => {
  const [request, setRequestData] = useState({ totalCount: 0, items: [] });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isSubscribed = true;
    createRequest(currentPage)
      .then((data) => {
        if (isSubscribed) {
          return setRequestData(data)
        }

        return null;
      });

    return () => (isSubscribed = false)
  }, [currentPage]);

  const pageCounts = paginationPageCounts(request.totalCount);
  const setPaginationPage = (page) => () => setCurrentPage(page);

  return (
    <div>
      <div className="PageList__head">
        List of Characters
      </div>
      {request.items.length ? (
        <React.Fragment>
          <div className="PageList__table">
            <PageListTable items={request.items} />
          </div>

          <div className="PageList__pagination">
            {pageCounts
              ? (
                <PageListPagination currentPageNum={currentPage} pagesCount={pageCounts} onPageClick={setPaginationPage}/>
              ) : null}
          </div>
        </React.Fragment>
      ) : 'Loading'}
    </div>
  )
};




async function createRequest (page) {
  let requestUrl = new URL('https://swapi.co/api/people/');

  if (page) {
    requestUrl.searchParams.set('page', page);
  }

  const request = new Request(requestUrl, { method: 'GET' });

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
  const result = swapiUrlString.match('/(?:\\D*\/)(\\d+)/');

  return result[1];
};


export default PageList;
