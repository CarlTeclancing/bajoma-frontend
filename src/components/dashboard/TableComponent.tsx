import React, { useState } from "react";

interface TableHeader {
  key: string;
  label: string;
}

interface TableProps {
  headers: TableHeader[];
  data: Record<string, any>[];
  itemsPerPage?: number;
}

const TableComponent: React.FC<TableProps> = ({
  headers,
  data,
  itemsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className="border border-gray-300 p-2 font-semibold"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header.key} className="border border-gray-300 p-2">
                  {row[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#78C726] text-white"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#78C726] text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
