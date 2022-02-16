import H4 from "@material-tailwind/react/Heading4";
export default function SessionCard({ color, session, onClick_ }) {
  return (
    <div
      className="mb-2 xs:my-8 sm:m-6 rounded-md shadow-lg mx-6 py-4 px-0 cursor-pointer border-l-4 border-4 border-blue-500 text-center bg-blue-50 text-blue-500 transition-all ease-out duration-400 transform hover-shadow-2xl hover:bg-blue-500 hover:text-blue-50 hover:border-blue-500"
      onClick={onClick_}
    >
      <H4 color="none" style={{ hover: "blue" }}>
        {session}
      </H4>
    </div>
  );
}
