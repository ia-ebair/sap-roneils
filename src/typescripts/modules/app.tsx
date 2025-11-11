/**
 *  Example app
 **/
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line react/no-deprecated
import { render } from "react-dom"
import { ThemeProvider, DEFAULT_THEME } from "@zendeskgarden/react-theming"
import { resizeContainer } from "../lib/helpers"
import { ReifiedClient } from 'reified-client-api';

const MAX_HEIGHT = 1500
// const API_ENDPOINTS = {
//     organizations: "/api/v2/organizations.json",
// }

const fetchCatFact = async (): Promise<string | void> =>  {
   const url = "https://catfact.ninja/fact";
  try {
    const response = await fetch(url, { headers: {"Content-Type": "application/json"} });
    const json = await response.json();
    console.log(json);
    return await json.fact; 
  } catch (error) {
    console.error(error);
    return
  }
}

const Header: React.FC = () => (
  <header className="mb-6">
    <h1 className="text-3xl font-bold text-gray-800">My Data App</h1>
  </header>
);

interface LabelProps {
    result: string
    darkMode: boolean
}

const Label: React.FC<LabelProps> = ({ result, darkMode }) => (
  <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
    <strong className="block text-lg">Result:</strong>
    <span className="text-md">{result || "Loading..."}</span>
  </div>
);

interface ButtonProps {
    setResult: React.Dispatch<React.SetStateAction<string>>
}

const Button: React.FC<ButtonProps> = ({ setResult }) => (
  <button 
    onClick={async () => {
        const catFact = await fetchCatFact()
        if (typeof catFact != "string") {
            return
        }
        setResult(catFact)}}
    className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    Set Result Manually
  </button>
);

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg shadow-sm">
      <p className="text-lg">Counter: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{count}</span></p>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="mt-2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg shadow hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Increment
      </button>
    </div>
  );
};

const MainWindow: React.FC = () => {
  const [result, setResult] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCatFact();
        if (typeof data === "string") {
          setResult(data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-50 max-h-full font-sans">
      {/* <Header /> */}
      <Label result={result} darkMode={true} />
      <Button setResult={setResult}/>
      <div>
        <Counter />
      </div>
    </div>
  );
}


class App {
    _client: ReifiedClient
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initializePromise: Promise<any>

    constructor(client: ReifiedClient) {
        this._client = client
        this.initializePromise = this.init()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async init(): Promise<any> {
        const appContainer = document.querySelector(".main")

        render(
            <ThemeProvider theme={{ ...DEFAULT_THEME }}>
                <MainWindow />
            </ThemeProvider>,
            appContainer,
        )
        return await resizeContainer(this._client, MAX_HEIGHT)
    }

    /**
     * Handle error
     * @param {Object} error error object
     */
    _handleError(error: Error): void {
        console.log("An error is handled here: ", error.message)
    }
}

export default App
