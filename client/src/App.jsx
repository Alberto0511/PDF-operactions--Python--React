import PdfToWordConverter from "./components/PdfToWordConverter";
import { CirclesWithBar } from "react-loader-spinner";
import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
const App = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);
  return (
    <>
      {loading ? (
        <div className="bg-[#e9e7e7] h-[100vh] flex justify-center items-center dark:bg-gray-900">
          <CirclesWithBar
            height="200"
            width="200"
            color="#16a085" 
            outerCircleColor="#D32F2F" 
            innerCircleColor="#E53935"
            barColor="#757575"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div>
          <NavBar />
          <PdfToWordConverter />
        </div>
      )}
    </>
  );
};

export default App;
