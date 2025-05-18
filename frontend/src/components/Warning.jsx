const Warning = ({ text, removeWarningFunction, color="red", time=3 }) => {
  let tailwindColors = {
    red: {
      text: "text-red-400",
      hoverText: "text-red-400 hover:text-red-100",
      border: "border-red-400",
    },
    green: {
      text: "text-green-400",
      hoverText: "text-green-400 hover:text-green-100",
      border: "border-green-400",
    },
    gray: {
      text: "text-gray-300",
      hoverText: "text-gray-300 hover:text-gray-100",
      border: "border-gray-300",
    },
  };

  return (
    <div
      className={`relative w-full bg-white/5 border rounded-xl flex flex-col overflow-hidden ${tailwindColors[color].border}`}
    >
      <div className="flex justify-between items-center px-4 py-2">
        <span className={`${tailwindColors[color].text}`}>{text}</span>
        <button
          onClick={removeWarningFunction}
          className={`cursor-pointer transition hover:font-bold ${tailwindColors[color].hoverText}`}
        >
          ✕
        </button>
      </div>
      <div className="w-full rounded">
        <div
          className={`h-full border-b-2 rounded ${tailwindColors[color].border}`}
          style={{
            animation: `shrink ${String(time)}s linear forwards`,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Warning;
