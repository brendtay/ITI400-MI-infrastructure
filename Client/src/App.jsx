import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from './components/Navbar';
import HomeButton from './components/HomeButton';


function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);  // This will store the fetched fruits

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api");
      console.log(response.data.fruits);
      setArray(response.data.fruits);  // Update array with the fetched fruits
    } catch (error) {
      console.error("Error fetching the API:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <>
 
      <div>
      <div>
      {/* Main Container for the Title */}
      <div className="container text-center my-4">
        <div style={{ color: 'white', fontSize: '40px' }}>
          <b>Report Public Infrastructure Issues</b>
        </div>
      </div>

      {/* Main Container for Navbar and HomeButton */}
      <div className="container"> {/* Bootstrap container for alignment */}
        <div className="row justify-content-center"> {/* Bootstrap row for flex layout */}
          <div className="col-auto"> {/* Column for Navbar with automatic width */}
            <Navbar />
          </div>
          <div className="col-auto"> {/* Column for HomeButton with automatic width */}
            <HomeButton />
          </div>
        </div>
      </div>
    </div>

    <div className="container text-center my-5">
</div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {
          array.length > 0 ? (  // Render the fruits if the array has data
            array.map((fruit, index) => (
              <div key={index}>
                <p>{fruit}</p>
              </div>
            ))
          ) : (
            <p>No fruits available</p>  // Fallback message if no data is fetched
          )
        }
      </div>

    </div>
      

    </>
  );
}

export default App;
