import { RotatingLines } from "react-loader-spinner";

export const Loader = () => (
  <div className="w-full grid place-items-center p-3">
    <RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="0.75"
      width="50"
      visible={true}
    />
  </div>
);

export default Loader;
