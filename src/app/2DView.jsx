import {
  ReactSVGPanZoom,
  TOOL_PAN,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  TOOL_AUTO,
} from "react-svg-pan-zoom";
import { useState } from "react";

// 2D View Component
export default function View2D({
  data,
  numItems,
  selectedItem,
  setSelectedItem,
}) {
  const containerWidth = data.container.width;
  const containerLength = data.container.length;

  // Scale factor to fit the view nicely
  const scale = 100;

  const [tool, setTool] = useState(TOOL_AUTO);

  return (
    <div className="h-full bg-white border w-full rounded-lg p-4 flex flex-col">
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
