// Transform nice.json data to match expected structure
const transformData = (rawData) => {
  // Group objects by stack name and stack them vertically
  const stackMap = new Map();

  // Group objects by stack name
  rawData.objects.forEach((obj) => {
    const stackName = obj.name;
    if (!stackMap.has(stackName)) {
      stackMap.set(stackName, []);
    }
    stackMap.get(stackName).push(obj);
  });

  // Process each stack
  const items = [];
  let idCounter = 0;

  stackMap.forEach((stack, stackName) => {
    // Filter out items without proper placement data
    const validStack = stack.filter(
      (item) =>
        item.placement &&
        item.placement.position &&
        typeof item.placement.position.x === "number" &&
        typeof item.placement.position.y === "number"
    );

    if (validStack.length === 0) return; // Skip stacks with no valid items

    // Sort stack items by stack_level (ascending)
    const sortedStack = [...validStack].sort(
      (a, b) => (a.placement.stack_level || 0) - (b.placement.stack_level || 0)
    );

    // Calculate cumulative heights for z-positioning
    const cumulativeHeights = [];
    let totalHeight = 0;

    sortedStack.forEach((item, index) => {
      cumulativeHeights.push(totalHeight);
      totalHeight += item.hoehe / 100;
    });

    // Transform each item with proper z-position
    sortedStack.forEach((item, index) => {
      const transformedItem = {
        id: idCounter++,
        type_id: item.id || index,
        type_name: item.name,
        product_name: item.name,
        center_x: item.placement.position.x / 1000,
        center_y: item.placement.position.y / 1000,
        center_z: cumulativeHeights[index], // Vertical position based on stack level
        geometry: item.form === "Zylinder" ? "circle" : "rectangle",
      };

      if (item.form === "Zylinder") {
        transformedItem.radius = item.placement.dimensions?.radius / 1000 || 10;
      } else {
        transformedItem.length = item.placement.dimensions?.length / 1000 || 10;
        transformedItem.width = item.placement.dimensions?.width / 1000 || 10;
        transformedItem.height = item.hoehe / 1000 || 10;
      }

      items.push(transformedItem);
    });
  });

  return {
    container: {
      length: rawData.container.length / 1000,
      width: rawData.container.width / 1000,
      height: rawData.container.height / 1000,
    },
    item_count: items.length,
    items: items,
  };
};
export { transformData };
