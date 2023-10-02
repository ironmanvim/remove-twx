import twx from "tailwindcssx";

export default function App({ theme }) {
  return (
    <div
      className={twx([
        "font-semibold",
        theme === "red" && ["border-red-500", "text-sm"],
        theme === "blue" && ["border-blue-500", "text-md"],
      ])}
    >
      Multiple Groups with conditions.
    </div>
  );
}
