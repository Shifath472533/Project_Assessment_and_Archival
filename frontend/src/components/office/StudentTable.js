import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import Button from "@material-tailwind/react/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import PaginationComponent from "../common/PaginationComponent";
import "../loader/Loader4.css";
import "../loader/Loader6.css";

export default function StudentTable(props) {
  const {
    session,
    headers,
    data,
    itemsCount,
    pageSize,
    currentPage,
    onPageChange,
    handleClick,
    handleStudentDeleteModal,
    showLoading,
    tabLoading,
    foundData,
  } = props;
  return (
    <Card>
      <CardHeader color="blue" contentPosition="none">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-white text-2xl">
            Student List of {session} session
          </h1>
          <Button
            color="white"
            buttonType="link"
            size="lg"
            style={{ padding: 0 }}></Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="w-full flex flex-col">
          {tabLoading && (
            <div className="w-full flex flex-row justify-center items-center text-2xl text-gray-600">
              <span className="loader6"></span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
              <thead className="">
                <tr className="bg-gray-200 shadow-md">
                  {headers.map((header) => {
                    return (
                      <th
                        className="px-2 font-bold text-lg text-blue-700 align-middle border-b border-solid border-gray-200 py-3 whitespace-nowrap text-center"
                        buttonType="outline"
                        size="lg">
                        {header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* {data && foundData === "not found" && <div>Nothing</div>} */}
                {data &&
                  foundData === "found" &&
                  data.map((row) => {
                    return (
                      <tr className="hover:shadow-lg hover:rounded hover:my-2 hover:bg-light-blue-500 hover:text-white cursor-pointer transform transition ease-out duration-300 hover:m-0">
                        <td
                          className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center"
                          onClick={() => handleClick(row)}>
                          {row.username}
                        </td>

                        <td
                          className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center"
                          onClick={() => handleClick(row)}>
                          {row.name}
                        </td>
                        <td
                          className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center"
                          onClick={() => handleClick(row)}>
                          {row.session}
                        </td>
                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">
                          <DeleteIcon
                            className="text-red-500 cursor-pointer hover:transition-transform ease-out duration-100 transform hover:scale-125"
                            onClick={() => handleStudentDeleteModal(row)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div className="w-full flex flex-row justify-center items-center">
              {(!data || (data && !data.length)) && showLoading && (
                <div className="my-5 flex flex-row justify-center content-center">
                  <span className="loader4"></span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-end mt-6">
          <PaginationComponent
            itemsCount={itemsCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      </CardBody>
    </Card>
  );
}
