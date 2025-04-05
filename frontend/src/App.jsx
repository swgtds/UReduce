import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; 
const App = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const isValidUrl = (url) => {
    try {
      new URL(url); 
      return true;
    } catch (_) {
      return false; 
    }
  };

  const handleShorten = () => {
    if (!url || !isValidUrl(url)) {
      setError("Link’s broken! Like my sleep schedule. 😵");
      return;
    }
    setError(""); 
  };

  const handleClear = () => {
    setUrl(""); 
    setError(""); 
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" 
      //change the background image URL to your preference
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2103&auto=format&fit=crop&ixlib=rb-4.0.3')" }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">URL Shortener</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Drop your chonky URL here🍩"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {url && (
            <button 
              onClick={handleClear} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <AiOutlineClose size={20} />
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={handleShorten}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Shorten
        </button>
      </div>
    </div>
  );
};

export default App;
