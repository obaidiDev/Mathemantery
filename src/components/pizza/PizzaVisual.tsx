
interface PizzaVisualProps {
  denominator: number;
  filledSlices: number[];
  onSliceClick: (index: number) => void;
  disabled?: boolean;
  showCorrectAnswer?: boolean;
  correctNumerator?: number;
}

export function PizzaVisual({
  denominator,
  filledSlices,
  onSliceClick,
  disabled = false,
  showCorrectAnswer = false,
  correctNumerator = 0,
}: PizzaVisualProps) {
  const size = 280;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  const innerRadius = 25;

  // Generate slice paths
  const generateSlicePath = (index: number): string => {
    const startAngle = (index * 360) / denominator - 90;
    const endAngle = ((index + 1) * 360) / denominator - 90;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    // Inner points for the hole
    const ix1 = centerX + innerRadius * Math.cos(startRad);
    const iy1 = centerY + innerRadius * Math.sin(startRad);
    const ix2 = centerX + innerRadius * Math.cos(endRad);
    const iy2 = centerY + innerRadius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${ix1} ${iy1}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${ix2} ${iy2}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}
      Z
    `;
  };

  // Generate toppings for filled slices
  const generateToppings = (index: number) => {
    const startAngle = (index * 360) / denominator - 90;
    const midAngle = startAngle + 180 / denominator;
    const midRad = (midAngle * Math.PI) / 180;
    const toppingRadius = (radius + innerRadius) / 2;

    const cx = centerX + toppingRadius * Math.cos(midRad);
    const cy = centerY + toppingRadius * Math.sin(midRad);

    // Create pepperoni circles
    const pepperoniPositions = [
      { x: cx - 15, y: cy - 10 },
      { x: cx + 10, y: cy + 5 },
      { x: cx - 5, y: cy + 15 },
    ];

    return pepperoniPositions.map((pos, i) => (
      <circle
        key={`pepperoni-${index}-${i}`}
        cx={pos.x}
        cy={pos.y}
        r={8}
        fill="#c0392b"
        stroke="#922b21"
        strokeWidth={1}
        className="transition-all duration-300"
      />
    ));
  };

  const isFilled = (index: number) => filledSlices.includes(index);

  const getSliceColor = (index: number) => {
    if (showCorrectAnswer) {
      if (index < correctNumerator) {
        return isFilled(index) ? '#f59e0b' : '#ef4444'; // Correct or missing
      } else {
        return isFilled(index) ? '#ef4444' : '#fef3c7'; // Wrong or correct empty
      }
    }
    return isFilled(index) ? '#f59e0b' : '#fef3c7';
  };

  return (
    <div className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] mx-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg w-full h-auto"
      >
        {/* Pizza base shadow */}
        <circle
          cx={centerX}
          cy={centerY + 5}
          r={radius + 5}
          fill="rgba(0,0,0,0.1)"
        />

        {/* Pizza crust */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 10}
          fill="#d4a574"
          stroke="#b8956e"
          strokeWidth={2}
        />

        {/* Pizza base */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="#fef3c7"
          stroke="#fbbf24"
          strokeWidth={2}
        />

        {/* Slices */}
        {Array.from({ length: denominator }).map((_, index) => (
          <g key={index}>
            <path
              d={generateSlicePath(index)}
              fill={getSliceColor(index)}
              stroke="#fbbf24"
              strokeWidth={2}
              className={`pizza-slice transition-all duration-300 ${
                !disabled ? 'hover:brightness-110 cursor-pointer' : ''
              } ${isFilled(index) ? 'filled' : ''}`}
              onClick={() => !disabled && onSliceClick(index)}
            />
            {/* Toppings for filled slices */}
            {isFilled(index) && generateToppings(index)}
          </g>
        ))}

        {/* Center hole */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="#fef3c7"
          stroke="#fbbf24"
          strokeWidth={2}
        />

        {/* Slice lines */}
        {Array.from({ length: denominator }).map((_, index) => {
          const angle = (index * 360) / denominator - 90;
          const rad = (angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(rad);
          const y = centerY + radius * Math.sin(rad);
          const ix = centerX + innerRadius * Math.cos(rad);
          const iy = centerY + innerRadius * Math.sin(rad);

          return (
            <line
              key={`line-${index}`}
              x1={ix}
              y1={iy}
              x2={x}
              y2={y}
              stroke="#d97706"
              strokeWidth={2}
              className="pointer-events-none"
            />
          );
        })}
      </svg>

      {/* Instruction text */}
      <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4">
        اضغط على الشرائح لتلوينها
      </p>
    </div>
  );
}

export default PizzaVisual;
