import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import Button from "@material-tailwind/react/Button";
import PaginationComponent from "./PaginationComponent";
import SelectPageItemsNoComponent from "./SelectPageItemsNoComponent";

export default function TableComponent(props) {
  const {
    headers,
    data,
    itemsCount,
    pageSize,
    currentPage,
    onPageChange,
    setPageSize,
  } = props;
  console.log(props.history);
  return (
    <Card>
      <CardHeader color="blue" contentPosition="none">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-white text-2xl">Page Visits</h1>
          <Button
            color="white"
            buttonType="link"
            size="lg"
            style={{ padding: 0 }}
          ></Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="">
              <tr className="bg-gray-200 shadow-md">
                {headers.map((header) => {
                  return (
                    <th
                      className="px-2 font-bold text-lg text-blue-700 align-middle border-b border-solid border-gray-200 py-3 whitespace-nowrap text-center"
                      buttonType="outline"
                      size="lg"
                    >
                      {header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                return (
                  <tr className="hover:shadow-lg hover:rounded hover:my-2 hover:bg-light-blue-500 hover:text-white cursor-pointer transform transition ease-out duration-300 hover:m-0">
                    {row.map((value) => {
                      return (
                        <td className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center">
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-between mt-6">
          <SelectPageItemsNoComponent
            mainColor="blue"
            color="blue"
            setPageSize={setPageSize}
          />
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
