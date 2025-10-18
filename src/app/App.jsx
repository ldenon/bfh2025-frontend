import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import Scene from "./Scene";
import { Button } from "@/components/ui/button";
import data from "@/data/data.json";

export default function App() {
  const [numItems, setNumItems] = useState(0);
  const [cameraAngle, setCameraAngle] = useState("top");
  const [selectedItem, setSelectedItem] = useState(null);

  const timelineRef = useRef(null);

  const sortedItems = [...data.items].sort((a, b) => b.center_y - a.center_y);
  const nextItem = sortedItems[numItems];

  // Autoscroll timeline to show next item
  useEffect(() => {
    if (timelineRef.current && numItems < sortedItems.length) {
      const container = timelineRef.current;
      const itemHeight = 56; // Approximate height of each timeline item (including gap)
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const nextItemTop = numItems * itemHeight;
      const nextItemBottom = nextItemTop + itemHeight;

      // Check if next item is not fully visible
      if (
        nextItemBottom > scrollTop + containerHeight ||
        nextItemTop < scrollTop
      ) {
        // Scroll to center the next item in the container
        const targetScrollTop = Math.max(
          0,
          nextItemTop - containerHeight / 2 + itemHeight / 2
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
      const containerHeight = container.clientHeight;
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
        selectedItemBottom > scrollTop + containerHeight ||
        selectedItemTop < scrollTop
      ) {
        // Scroll to center the selected item in the container
        const targetScrollTop = Math.max(
          0,
          selectedItemTop - containerHeight / 2 + itemHeight / 2
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

          {/* {selectedItem && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Selected Item</h2>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Geometry:</strong> {selectedItem.geometry}
                </p>
                {selectedItem.geometry === "rectangle" && (
                  <>
                    <p>
                      <strong>Width:</strong> {selectedItem.width}
                    </p>
                    <p>
                      <strong>Height:</strong> {selectedItem.height}
                    </p>
                  </>
                )}
                {selectedItem.geometry === "circle" && (
                  <p>
                    <strong>Radius:</strong> {selectedItem.radius}
                  </p>
                )}
                <p>
                  <strong>Center X:</strong> {selectedItem.center_x}
                </p>
                <p>
                  <strong>Center Y:</strong> {selectedItem.center_y}
                </p>
              </div>
            </div>
          )} */}
        </div>
      </div>

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
    </div>
  );
}
