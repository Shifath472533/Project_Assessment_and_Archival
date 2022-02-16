import React from "react";
import Pagination from "@material-tailwind/react/Pagination";
import PaginationItem from "@material-tailwind/react/PaginationItem";
import Icon from "@material-tailwind/react/Icon";
import lodash from "lodash";
import GetVisiblePageNumbers from "../../utilityFuctions/GetVisiblePageNumbers";

export default function PaginationComponent({
  itemsCount,
  pageSize,
  currentPage,
  onPageChange,
}) {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  // if (pagesCount === 1) return null;
  const pages = lodash.range(1, pagesCount + 1);
  const visiblePages = GetVisiblePageNumbers(pages, currentPage);
  const forward = () => {
    if (currentPage !== pagesCount) {
      onPageChange(currentPage + 1);
    }
  };
  const backward = () => {
    if (currentPage !== 1) {
      onPageChange(currentPage - 1);
    }
  };
  return (
    <div>
      {pagesCount > 1 && (
        <Pagination className="transition-all ease-out duration-500">
          <PaginationItem
            className="cursor-pointer"
            button
            onClick={() => onPageChange(1)}
            ripple="dark"
          >
            First
          </PaginationItem>
          <PaginationItem
            className="cursor-pointer"
            onClick={backward}
            ripple="dark"
          >
            <Icon name="keyboard_arrow_left" />
          </PaginationItem>
          {visiblePages.map((page) => {
            return (
              <PaginationItem
                className="cursor-pointer"
                key={page}
                color={page === currentPage ? "lightBlue" : ""}
                ripple="light"
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationItem>
            );
          })}

          <PaginationItem
            className="cursor-pointer"
            onClick={forward}
            ripple="dark"
          >
            <Icon name="keyboard_arrow_right" />
          </PaginationItem>
          <PaginationItem
            className="cursor-pointer"
            button
            onClick={() => onPageChange(pagesCount)}
            ripple="dark"
          >
            Last
          </PaginationItem>
        </Pagination>
      )}
    </div>
  );
}
