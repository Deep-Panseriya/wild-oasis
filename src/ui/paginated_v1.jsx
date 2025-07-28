import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 3;

export default function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (pageCount <= 1) return null;

  function goToPage(page) {
    searchParams.set("page", page);
    setSearchParams(searchParams);
  }

  function handlePrevious() {
    if (currentPage > 1) goToPage(currentPage - 1);
  }

  function handleNext() {
    if (currentPage < pageCount) goToPage(currentPage + 1);
  }

  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
      <button onClick={handlePrevious} disabled={currentPage === 1}>
        Previous
      </button>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => goToPage(pageNum)}
          style={{
            fontWeight: pageNum === currentPage ? "bold" : "normal",
            textDecoration: pageNum === currentPage ? "underline" : "none",
          }}
        >
          {pageNum}
        </button>
      ))}

      <button onClick={handleNext} disabled={currentPage === pageCount}>
        Next
      </button>
    </div>
  );
}
