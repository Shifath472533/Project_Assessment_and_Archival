export default function Container({ children }) {
  return (
    // <div className="absolute top-1/2 left-1/3 transform -translate-x-2/3 -translate-y-1/2">
    //     <div className="max-w-sm w-96">{children}</div>
    // </div>
    <div className="flex flex-row justify-center mt-32 mx-3">
      <div className="max-w-sm w-96">{children}</div>
    </div>
  );
}
