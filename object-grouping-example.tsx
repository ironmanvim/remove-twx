import twx from "tailwindcssx";

export default function App() {
  return (
    <div
      className={twx({
        "": [
          "border-red-500", // with no separator
        ],
        hover: ["border-blue-500"],
        md: {
          "": ["text-red-600"],
          hover: ["text-green-600", "text-sm"],
        },
      })}
    >
      Object Grouping
    </div>
  );
}
