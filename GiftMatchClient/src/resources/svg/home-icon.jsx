import * as React from "react"

const HomeIcon = ({
    size = 24,
    color = "#000000"
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none">
    <path
      fill={color}
      fillRule="evenodd"
      d="M12.594 1.994a.938.938 0 0 0-1.189 0l-10.062 8.25a.937.937 0 0 0 .594 1.662h1.458l.745 8.142c.073.805.748 1.42 1.556 1.42h3.492c.345 0 .625-.28.625-.625v-4.802c0-1.875 1.53-1.875 1.874-1.875h.626c.345 0 1.874 0 1.874 1.875v4.802c0 .346.28.625.626.625h3.492c.807 0 1.482-.615 1.555-1.42l.745-8.142h1.457a.938.938 0 0 0 .595-1.662l-10.063-8.25Z"
      clipRule="evenodd"
    />
  </svg>
)
export default HomeIcon