import { useState } from "react";
import Warning from "../components/Warning";

const CreateAsciiPage = () => {
  let [image, setImage] = useState(null);
  let [textW, setTextW] = useState(100);
  let [textH, setTextH] = useState(50);
  let [loading, setLoading] = useState(false);
  let [isDragging, setIsDragging] = useState(false);
  let [warnings, setWarnings] = useState([]);
  let [asciiText, setAsciiText] = useState("");
  let backendUrl = "http://127.0.0.1:8000/";

  let addWarning = (text, color="red", time=3) => {
    let id = Date.now();
    setWarnings((prev) => [...prev, { id, text, color, time }]);
    setTimeout(() => {
      setWarnings((prev) => prev.filter((w) => w.id !== id));
    }, time*1000);
  };

  let removeWarning = (id) => {
    setWarnings((prev) => prev.filter((w) => w.id !== id));
  };

  let handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  let handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  let handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    let droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setImage(droppedFile);
      const img = new Image();
      const objectUrl = URL.createObjectURL(droppedFile);
      img.onload = () => {
        let bestH = Math.round(41.85 * img.height / img.width);
        URL.revokeObjectURL(objectUrl);
        addWarning(`Recommended text width, height = ${100} x ${bestH}`, "gray", 10);
      };
      img.src = objectUrl;
    } else {
      addWarning("Only image files are supported.");
    }
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    if (!Number.isInteger(textW) || !Number.isInteger(textH)) {
      addWarning("Please enter integers for text width and height");
      return;
    }
    if (!image) {
      addWarning("Please enter an image");
      return;
    }

    setLoading(true);
    setAsciiText("");

    try {
      let formData = new FormData();
      formData.append("image", image);
      formData.append("text_w", textW);
      formData.append("text_h", textH);
      let response = await fetch(backendUrl + "get_ascii", {
        method: "POST",
        body: formData,
      });
      let data = await response.json();
      if (response.ok) {
        setAsciiText(data.ascii_text);
      } else {
        addWarning(data.error || "Something went wrong");
      }
    } catch (error) {
      addWarning("Failed to connect to backend: " + error.text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000042] via-black to-[#450000] flex items-center justify-center p-8">
      <div className="w-fit min-w-100 bg-white/5 border border-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl flex flex-col">
        <h1 className="text-3xl font-bold text-white text-center tracking-tight mb-8">
          Convert Image to ASCII Art
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* file input */}
          <div
            className={`w-full text-sm text-gray-200 bg-white/5 p-3 rounded-2xl border-2 border-dashed transition ${
              isDragging ? "border-blue-400 bg-white/10" : "border-white/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className="cursor-pointer w-full">
              <span className="text-white text-sm">
                Drag & Drop or Click to Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>

            {image && (
              <p className="mt-2 text-xs text-white/80">
                Selected: {image.name}
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* text width input */}
            <div className="flex-1">
              <label className="text-sm text-white mb-1 block">
                Text Width
              </label>
              <input
                type="number"
                value={textW}
                onChange={(e) => setTextW(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* text height input */}
            <div className="flex-1">
              <label className="text-sm text-white mb-1 block">
                Text Height
              </label>
              <input
                type="number"
                value={textH}
                onChange={(e) => setTextH(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-white/5 hover:bg-white/20 border border-white/20 cursor-pointer rounded-xl text-white font-bold transition"
          >
            Generate ASCII
          </button>
        </form>

        {/* warnings */}
        {warnings.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {warnings.map((warning) => (
              <Warning
                key={warning.id}
                text={warning.text}
                removeWarningFunction={() => removeWarning(warning.id)}
                color={warning.color}
                time={warning.time}
              />
            ))}
          </div>
        )}

        {/* loader */}
        {loading && (
          <div className="mt-6 self-center">
            <div className="h-6 w-6 rounded-full border-2 border-white border-y-white/20 animate-spin" />
          </div>
        )}

        {/* ascii text */}
        {asciiText && (
          <div className="mt-6 bg-white/5 border border-white/20 rounded-2xl text-white font-mono text-sm p-4 py-3 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(asciiText);
                addWarning("Copied to clipboard!", "green", 2);
              }}
              className="bg-white/5 hover:bg-white/20 border border-white/20 cursor-pointer rounded-xl text-white font-bold transition px-3 py-1"
            >
              Copy
            </button>
            <pre className="overflow-x-auto whitespace-pre">{asciiText}</pre>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateAsciiPage;
