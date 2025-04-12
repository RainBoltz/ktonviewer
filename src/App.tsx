/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  loadElectorState,
  electorStateStringify,
} from "./elector-utils-official";
import { Address } from "@ton/core";
import ReactJson from "react-json-view";
import {
  controllerStateStringify,
  loadControllerState,
} from "./controller-utils";

function addressDisplay(addr: string, isTestnet: boolean = false) {
  try {
    return Address.parse(addr).toString({
      testOnly: isTestnet,
      bounceable: true,
    });
  } catch (e) {
    return addr;
  }
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isTestnet = urlParams.get("testnet") !== null;

  const [leftAddress, setLeftAddress] = useState("");
  const [rightAddress] = useState(
    addressDisplay(
      "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF",
      isTestnet
    )
  );
  const [leftData, setLeftData] = useState<any>({});
  const [rightData, setRightData] = useState<any>({});
  const [isLeftLoading, setIsLeftLoading] = useState(false);
  const [isRightLoading, setIsRightLoading] = useState(false);

  const handleLeftSubmit = async () => {
    setIsLeftLoading(true);
    //try {
      const data = await loadControllerState(leftAddress, isTestnet);
      setLeftData(data);
    // } catch (error) {
    //   setLeftData({ error: "Failed to fetch data" });
    // } finally {
    //   setIsLeftLoading(false);
    // }
  };

  const handleRightRefresh = async () => {
    setIsRightLoading(true);
    try {
      const data = await loadElectorState(isTestnet);
      setRightData(data);
    } catch (error) {
      console.log(error);
      setRightData({ error: "Failed to refresh data" });
    } finally {
      setIsRightLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Left Panel */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={leftAddress}
              onChange={(e) => setLeftAddress(e.target.value)}
              placeholder="Controller contract address"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLeftSubmit}
              disabled={isLeftLoading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors ${
                isLeftLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isLeftLoading ? "fetching" : "Submit"}
            </button>
          </div>
          <ReactJson src={JSON.parse(controllerStateStringify(leftData))} />
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={rightAddress}
              disabled
              placeholder="Elector contract address"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
            />
            <button
              onClick={handleRightRefresh}
              disabled={isRightLoading}
              className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 ${
                isRightLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
            >
              <RefreshCw
                size={18}
                className={isRightLoading ? "animate-spin" : ""}
              />
              {isRightLoading ? "fetching" : "Refresh"}
            </button>
          </div>
          <ReactJson src={JSON.parse(electorStateStringify(rightData))} />
        </div>
      </div>
    </div>
  );
}

export default App;
