import { useState } from "react";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleShorten = async () => {
    if (!url || !isValidUrl(url)) {
      setError("Link’s broken! Like my sleep schedule. 😵");
      setShortUrl("");
      return;
    }

    try {
      setError("");
      const res = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      const fullShortUrl = `${API_URL}/${data.short_url}`;
      setShortUrl(fullShortUrl);
    } catch (err) {
      setError("Oops! Something went wrong.");
      setShortUrl("");
    }
  };

  const handleClear = () => {
    setUrl("");
    setShortUrl("");
    setError("");
    setCopied(false);
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=2103&auto=format&fit=crop&ixlib=rb-4.0.3')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">UReduce</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Drop your chonky URL here 🍩"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {url && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={handleShorten}
          className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-red-500 transition"
        >
          Shorten
        </button>

        {shortUrl && (
          <div className="mt-4 bg-green-100 p-3 rounded flex items-center justify-between">
            <a
              href={shortUrl}
              className="text-blue-700 font-medium break-all"
              target="_blank"
              rel="noreferrer"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition flex items-center gap-1"
            >
              {copied ? "Copied!" : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m-4-4h6m-6 0V5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2z"
                  />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;