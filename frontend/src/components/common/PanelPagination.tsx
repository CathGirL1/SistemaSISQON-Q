import "../../styles/CommonPanel.css";

type PanelPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function PanelPagination({
  currentPage,
  totalPages,
}: PanelPaginationProps) {
  return (
    <div className="panel-pagination">

      <button>{"<"}</button>

      {Array.from({ length: totalPages }).map((_, index) => (

        <button
          key={index}
          className={currentPage === index + 1 ? "active" : ""}
        >
          {index + 1}
        </button>

      ))}

      <button>{">"}</button>

    </div>
  );
}