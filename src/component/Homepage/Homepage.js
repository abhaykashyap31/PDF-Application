import { useState } from "react";

export default function PdfTools() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (event, setFiles) => {
    const files = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index, setFiles) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const simulateProcessing = (callback) => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      callback();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="text-center bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-green-500">PDF Tools</h1>
        <p className="text-gray-400">Easy PDF manipulation and conversion tools</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Merge & Split */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Split & Merge PDF</h2>
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            id="pdfInput"
            onChange={(e) => handleFileUpload(e, setPdfFiles)}
          />
          <label
            htmlFor="pdfInput"
            className="block border-2 border-green-500 border-dashed p-4 text-center rounded cursor-pointer hover:bg-green-900/10"
          >
            Drop PDF files here or click to upload
          </label>
          <ul className="mt-4 max-h-32 overflow-auto">
            {pdfFiles.map((file, index) => (
              <li key={index} className="flex justify-between bg-gray-700 p-2 rounded mb-1">
                {file.name}
                <button
                  onClick={() => removeFile(index, setPdfFiles)}
                  className="text-red-500 hover:text-red-400"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded w-full disabled:bg-gray-600"
            disabled={pdfFiles.length === 0 || processing}
            onClick={() => simulateProcessing(() => alert("PDFs merged successfully!"))}
          >
            Merge PDFs
          </button>
        </div>

        {/* Image to PDF */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Image to PDF</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="imageInput"
            onChange={(e) => handleFileUpload(e, setImageFiles)}
          />
          <label
            htmlFor="imageInput"
            className="block border-2 border-green-500 border-dashed p-4 text-center rounded cursor-pointer hover:bg-green-900/10"
          >
            Drop image files here or click to upload
          </label>
          <ul className="mt-4 max-h-32 overflow-auto">
            {imageFiles.map((file, index) => (
              <li key={index} className="flex justify-between bg-gray-700 p-2 rounded mb-1">
                {file.name}
                <button
                  onClick={() => removeFile(index, setImageFiles)}
                  className="text-red-500 hover:text-red-400"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded w-full disabled:bg-gray-600"
            disabled={imageFiles.length === 0 || processing}
            onClick={() => simulateProcessing(() => alert("Images converted to PDF successfully!"))}
          >
            Convert to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
