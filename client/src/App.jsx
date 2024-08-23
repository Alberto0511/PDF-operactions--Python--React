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
        <div className="bg-slate-100 h-[100vh] flex justify-center items-center">
          <CirclesWithBar
            height="200"
            width="200"
            color="#95a5a6"
            outerCircleColor="#34495e"
            innerCircleColor="#16a085"
            barColor="#7f8c8d"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div>
          <NavBar/>
          <PdfToWordConverter />
        </div>
      )}
    </>
  );
};

export default App;
