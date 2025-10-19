import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import Scene from "./Scene";
import { Button } from "@/components/ui/button";
import rawData from "@/data/nice.json";
import {
  ReactSVGPanZoom,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  TOOL_AUTO,
} from "react-svg-pan-zoom";

import { transformData } from "@/lib/data.js";
const data = transformData(rawData);

// 2D View Component
function View2D({ data, numItems, selectedItem, setSelectedItem }) {
  const containerWidth = data.container.width;
  const containerLength = data.container.length;

  console.log(data);

  // Scale factor to fit the view nicely
  const scale = 100;

  const [tool, setTool] = useState(TOOL_AUTO);

  return (
    <div className="col-span-2 bg-white border w-full rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
        Container Layout (Top View)
      </h3>
      <div className="flex-1 flex justify-center min-h-0">
        <ReactSVGPanZoom
          height="100%"
          tool={tool}
          onChangeTool={setTool}
          background="#f8fafc"
          SVGBackground="#f8fafc"
          miniatureProps={{
            position: "none",
          }}
          toolbarProps={{
            position: "right",
          }}
        >
          <svg
            width={containerWidth * scale + 400}
            height={containerLength * scale + 600}
            viewBox={`0 0 ${containerWidth * scale + 400} ${
              containerLength * scale + 600
            }`}
          >
            {/* Container outline */}
            <rect
              y={40}
              width={containerWidth * scale}
              height={containerLength * scale}
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Items */}
            {data.items.slice(0, numItems).map((item, index) => {
              const isSelected = selectedItem && selectedItem.id === item.id;

              const itemWidth = item.width;
              const itemHeight = item.length;

              return (
                <g key={item.id}>
                  {item.geometry === "circle" ? (
                    <circle
                      cx={item.center_x * scale}
                      cy={40 + item.center_y * scale}
                      r={item.radius * scale}
                      fill={isSelected ? "#3B82F6" : "#10B981"}
                      stroke={isSelected ? "#1D4ED8" : "#059669"}
                      strokeWidth="2"
                      opacity={isSelected ? "0.8" : "0.6"}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedItem(item)}
                    />
                  ) : (
                    <rect
                      x={(item.center_x - itemWidth / 2) * scale}
                      y={40 + (item.center_y - itemHeight / 2) * scale}
                      width={itemWidth * scale}
                      height={itemHeight * scale}
                      fill={isSelected ? "#3B82F6" : "#10B981"}
                      stroke={isSelected ? "#1D4ED8" : "#059669"}
                      strokeWidth="2"
                      opacity={isSelected ? "0.8" : "0.6"}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedItem(item)}
                    />
                  )}
                  {/* Item label */}
                  <text
                    x={item.center_x * scale}
                    y={40 + item.center_y * scale}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="white"
                    fontWeight="bold"
                    style={{ pointerEvents: "none" }}
                  >
                    {index + 1}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform={`translate(20, ${containerLength * scale + 70})`}>
              <circle cx="10" cy="10" r="6" fill="#10B981" opacity="0.6" />
              <text x="25" y="15" fontSize="12" fill="#374151">
                Items Added
              </text>
              <circle cx="120" cy="10" r="6" fill="#3B82F6" opacity="0.8" />
              <text x="135" y="15" fontSize="12" fill="#374151">
                Selected
              </text>
            </g>
          </svg>
        </ReactSVGPanZoom>
      </div>
    </div>
  );
}

export default function App() {
  const [numItems, setNumItems] = useState(0);
  const [cameraAngle, setCameraAngle] = useState("top");
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("3D"); // "2D" or "3D"

  const timelineRef = useRef(null);

  const sortedItems = [...data.items].sort((a, b) => b.center_y - a.center_y);
  const nextItem = sortedItems[numItems];

  // Autoscroll timeline to show next item
  useEffect(() => {
    if (timelineRef.current && numItems < sortedItems.length) {
      const container = timelineRef.current;
      const itemHeight = 56; // Approximate height of each timeline item (including gap)
      const containerLength = container.clientHeight;
      const scrollTop = container.scrollTop;
      const nextItemTop = numItems * itemHeight;
      const nextItemBottom = nextItemTop + itemHeight;

      // Check if next item is not fully visible
      if (
        nextItemBottom > scrollTop + containerLength ||
        nextItemTop < scrollTop
      ) {
        // Scroll to center the next item in the container
        const targetScrollTop = Math.max(
          0,
          nextItemTop - containerLength / 2 + itemHeight / 2
        );
        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [numItems, sortedItems.length]);

  // Autoscroll timeline to show selected item
  useEffect(() => {
    if (timelineRef.current && selectedItem) {
      const container = timelineRef.current;
      const itemHeight = 56; // Approximate height of each timeline item (including gap)
      const containerLength = container.clientHeight;
      const scrollTop = container.scrollTop;

      // Find the index of the selected item in sortedItems
      const selectedIndex = sortedItems.findIndex(
        (item) => item.id === selectedItem.id
      );
      if (selectedIndex === -1) return;

      const selectedItemTop = selectedIndex * itemHeight;
      const selectedItemBottom = selectedItemTop + itemHeight;

      // Check if selected item is not fully visible
      if (
        selectedItemBottom > scrollTop + containerLength ||
        selectedItemTop < scrollTop
      ) {
        // Scroll to center the selected item in the container
        const targetScrollTop = Math.max(
          0,
          selectedItemTop - containerLength / 2 + itemHeight / 2
        );
        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [selectedItem, sortedItems]);

  return (
    <div className=" p-12 h-screen grid md:grid-cols-3">
      <div className="col-span-1 px-6">
        <h1 className="text-sm  text-gray-500">ORDER</h1>
        <h1 className="text-2xl">ORD-2023-1027-A4B8</h1>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">View Mode</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "2D" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("2D")}
            >
              2D
            </Button>
            <Button
              variant={viewMode === "3D" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("3D")}
            >
              3D
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Camera Angles</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCameraAngle("top")}
            >
              Top
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCameraAngle("front")}
            >
              Front
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCameraAngle("left")}
            >
              Left
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCameraAngle("right")}
            >
              Right
            </Button>
          </div>
        </div>
        <div className="mt-12">
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Items in Container</span>
              <span>
                {numItems} / {data.items.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(numItems / data.items.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {data.items.length - numItems} items remaining to add
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() =>
                setNumItems((prev) => Math.min(prev + 1, data.items.length))
              }
              disabled={numItems === data.items.length}
            >
              Next Item
            </Button>
            <Button
              onClick={() => setNumItems((prev) => Math.max(prev - 1, 0))}
              disabled={numItems === 0}
            >
              Remove item
            </Button>
            <Button
              onClick={() => setNumItems(data.items.length)}
              disabled={numItems === data.items.length}
            >
              All
            </Button>
            <Button onClick={() => setNumItems(0)} disabled={numItems === 0}>
              Remove All
            </Button>
          </div>
          {/* Timeline of items */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              List of products :
            </h3>
            <div
              className="space-y-2 max-h-64 overflow-y-auto"
              ref={timelineRef}
            >
              {sortedItems.map((item, index) => {
                const isAdded = index < numItems;
                const isNext = index === numItems;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer ${
                      selectedItem && selectedItem.id === item.id
                        ? isAdded
                          ? "bg-green-100 border border-green-300"
                          : isNext
                          ? "bg-blue-100 border border-blue-300"
                          : "bg-gray-100 border border-gray-300"
                        : isAdded
                        ? "bg-green-50 border border-green-200"
                        : isNext
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Timeline indicator */}
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        isAdded
                          ? "bg-green-500"
                          : isNext
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    />

                    {/* Item info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-medium truncate ${
                          isAdded
                            ? "text-green-800"
                            : isNext
                            ? "text-blue-800"
                            : "text-gray-600"
                        }`}
                      >
                        {item.type_name || item.product_name}
                      </div>
                      <div
                        className={`text-xs ${
                          isAdded
                            ? "text-green-600"
                            : isNext
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        ID: {item.id}
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        isAdded
                          ? "bg-green-100 text-green-700"
                          : isNext
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isAdded ? "Added" : isNext ? "Next" : "Pending"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {viewMode === "3D" ? (
        <Canvas
          className="col-span-2 bg-white border-1 rounded-lg"
          shadows
          camera={{ position: [-1, 10, 0], fov: 80 }}
        >
          <Scene
            numItems={numItems}
            cameraAngle={cameraAngle}
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
          />
        </Canvas>
      ) : (
        <View2D
          data={data}
          numItems={numItems}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      )}
    </div>
  );
}
