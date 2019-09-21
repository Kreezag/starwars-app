import Pagination from 'react-bootstrap/Pagination';
import React from 'react';
import './PageCharactersPagination.less';

const PageCharactersPagination = ({
  currentPageNum = 1,
  pagesCount = 1,
  onPageClick = () => null,
}) => {
  const pageNumbers = new Array(pagesCount).fill('').map((_, index) => index + 1);

  return (
    <Pagination>
      {pageNumbers.map(value => (
        <Pagination.Item
          key={value}
          active={value === currentPageNum}
          onClick={onPageClick(value)}
        >
          {value}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default PageCharactersPagination;
