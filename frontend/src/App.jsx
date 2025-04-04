import { useState } from "react";

const App = () => {
  const [url, setUrl] = useState("");

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat shadow-2xl"
        //change the background image URL to your preference
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2103&auto=format&fit=crop&ixlib=rb-4.0.3')",
          filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.5))"
        }}
      ></div>
      <div className="relative z-10 bg-white bg-opacity-80 p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">UReduce</h1>
        <input
          type="text"
          placeholder="Drop your chonky URL here🍩"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-red-500 transition">
          Shorten
        </button>
      </div>
    </div>
  );
};

export default App;
