import Card from "@material-tailwind/react/Card";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardBody from "@material-tailwind/react/CardBody";
import Button from "@material-tailwind/react/Button";
import PaginationComponent from "../common/PaginationComponent";
import { usePromiseTracker } from "react-promise-tracker";
import "../loader/Loader4.css";

export default function CurrentCourseTable(props) {
  const semDict = {
    1: "1/1",
    2: "1/2",
    3: "2/1",
    4: "2/2",
    5: "3/1",
    6: "3/2",
    7: "4/1",
    8: "4/2",
  };
  const {
    headers,
    courseList,
    data,
    itemsCount,
    pageSize,
    currentPage,
    onPageChange,
    handleClick,
  } = props;
  console.log(courseList);
  const { promiseInProgress } = usePromiseTracker();
  return (
    <Card>
      <CardHeader color="blue" contentPosition="none">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-white text-2xl">Current Courses</h1>
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
              {!promiseInProgress && data.length === 0 && <div>No data</div>}
              {courseList.length > 0 &&
                courseList.map((row) => {
                  return (
                    <tr className="hover:shadow-lg hover:rounded hover:my-2 hover:bg-light-blue-500 hover:text-white cursor-pointer transform transition ease-out duration-300 hover:m-0">
                      <td
                        className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center"
                        onClick={() => handleClick(row)}
                      >
                        {row.courseDetails.code}
                      </td>
                      <td
                        className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center"
                        onClick={() => handleClick(row)}
                      >
                        {row.courseDetails.title}
                      </td>
                      <td
                        className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center"
                        onClick={() => handleClick(row)}
                      >
                        {semDict[row.courseDetails.semester]}
                      </td>
                      <td
                        className="border-b border-gray-200 align-middle font-light text-sm whitespace-nowrap px-2 py-4 text-center"
                        onClick={() => handleClick(row)}
                      >
                        {row.eachCourse.year}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="w-full flex flex-row justify-center items-center">
            {(!data || !data.length) && (
              <div className="my-5 flex flex-row justify-center content-center">
                <span className="loader4"></span>
              </div>
            )}
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
