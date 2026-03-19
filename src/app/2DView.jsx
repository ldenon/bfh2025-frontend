import {
  UncontrolledReactSVGPanZoom,
  TOOL_AUTO,
} from "react-svg-pan-zoom";
import { useEffect, useRef, useState } from "react";

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
  const topPadding = 40;
  const containerOffsetX = containerWidth / 2;
  const containerOffsetY = containerLength / 2;
  const viewWidth = containerWidth * scale + 400;
  const viewHeight = containerLength * scale + 600;
  const legendY = topPadding + containerLength * scale + 30;

  const toSvgX = (x) => (x + containerOffsetX) * scale;
  const toSvgY = (y) => topPadding + (y + containerOffsetY) * scale;

  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [viewerSize, setViewerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      setViewerSize({
        width: Math.max(1, Math.floor(width)),
        height: Math.max(1, Math.floor(height)),
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setViewerSize({
        width: Math.max(1, Math.floor(width)),
        height: Math.max(1, Math.floor(height)),
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full bg-white border w-full rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
        Container Layout (Top View)
      </h3>
      <div className="flex-1 flex justify-center min-h-0" ref={containerRef}>
        {viewerSize.width > 0 && viewerSize.height > 0 ? (
          <UncontrolledReactSVGPanZoom
            ref={viewerRef}
            width={viewerSize.width}
            height={viewerSize.height}
            defaultTool={TOOL_AUTO}
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
              width={viewWidth}
              height={viewHeight}
              viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            >
              {/* Container outline */}
              <rect
                x={0}
                y={topPadding}
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
                        cx={toSvgX(item.center_x)}
                        cy={toSvgY(item.center_y)}
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
                        x={toSvgX(item.center_x - itemWidth / 2)}
                        y={toSvgY(item.center_y - itemHeight / 2)}
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
                      x={toSvgX(item.center_x)}
                      y={toSvgY(item.center_y)}
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
              <g transform={`translate(20, ${legendY})`}>
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
          </UncontrolledReactSVGPanZoom>
        ) : null}
      </div>
    </div>
  );
}
