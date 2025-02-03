import { useState } from "react";
import axios from "axios";

export default function PdfTools() {
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFiles, setSplitFiles] = useState([]); // Only one file will be stored for splitting
  const [imageFiles, setImageFiles] = useState([]);
  const [startPage, setStartPage] = useState(1); // State for start page
  const [endPage, setEndPage] = useState(1); // State for end page
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (event, setFiles, isSplit = false) => {
    const files = Array.from(event.target.files);
    if (isSplit) {
      // For split, only allow one file
      setFiles([files[0]]);
    } else {
      setFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index, setFiles) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    setProcessing(true);
    const formData = new FormData();
    mergeFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:5000/merge", formData, { responseType: "blob" });
      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "merged.pdf";
      link.click();
    } catch (error) {
      console.error("Error merging PDFs:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSplit = async () => {
    setProcessing(true);
    const formData = new FormData();
    splitFiles.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("start_page", startPage); // Adding start_page to formData
    formData.append("end_page", endPage);     // Adding end_page to formData

    try {
      const response = await axios.post("http://127.0.0.1:5000/split", formData, { responseType: "blob" });
      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "split_output.pdf";  // Updated to PDF for the split file
      link.click();
    } catch (error) {
      console.error("Error splitting PDFs:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleConvertToPdf = async () => {
    setProcessing(true);
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:5000/convert", formData, { responseType: "blob" });
      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "converted.pdf";
      link.click();
    } catch (error) {
      console.error("Error converting images to PDF:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="text-center bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-green-500">PDF Tools</h1>
        <p className="text-gray-400">Easy PDF manipulation and conversion tools</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PDF Merge */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Merge PDF</h2>
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            id="pdfInputMerge"
            onChange={(e) => handleFileUpload(e, setMergeFiles)}
          />
          <label
            htmlFor="pdfInputMerge"
            className="block border-2 border-green-500 border-dashed p-4 text-center rounded cursor-pointer hover:bg-green-900/10"
          >
            Drop PDF files here or click to upload
          </label>
          <ul className="mt-4 max-h-32 overflow-auto">
            {mergeFiles.map((file, index) => (
              <li key={index} className="flex justify-between bg-gray-700 p-2 rounded mb-1">
                {file.name}
                <button
                  onClick={() => removeFile(index, setMergeFiles)}
                  className="text-red-500 hover:text-red-400"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded w-full disabled:bg-gray-600"
            disabled={mergeFiles.length === 0 || processing}
            onClick={handleMerge}
          >
            Merge PDFs
          </button>
        </div>

        {/* PDF Split */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-500 mb-4">Split PDF</h2>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            id="pdfInputSplit"
            onChange={(e) => handleFileUpload(e, setSplitFiles, true)} // Only one file for split
          />
          <label
            htmlFor="pdfInputSplit"
            className="block border-2 border-green-500 border-dashed p-4 text-center rounded cursor-pointer hover:bg-green-900/10"
          >
            Drop one PDF file here or click to upload
          </label>
          <ul className="mt-4 max-h-32 overflow-auto">
            {splitFiles.length > 0 && (
              <li className="flex justify-between bg-gray-700 p-2 rounded mb-1">
                {splitFiles[0].name}
                <button
                  onClick={() => setSplitFiles([])} // Clear the file from state
                  className="text-red-500 hover:text-red-400"
                >
                  ✖
                </button>
              </li>
            )}
          </ul>

          {/* Page Range Inputs */}
          <div className="mt-4">
            <label className="block text-green-500">Start Page</label>
            <input
              type="number"
              value={startPage}
              onChange={(e) => setStartPage(Number(e.target.value))}
              className="w-full p-2 border border-green-500 rounded bg-gray-700 text-white"
              min="1"
            />
          </div>
          <div className="mt-4">
            <label className="block text-green-500">End Page</label>
            <input
              type="number"
              value={endPage}
              onChange={(e) => setEndPage(Number(e.target.value))}
              className="w-full p-2 border border-green-500 rounded bg-gray-700 text-white"
              min={startPage}
            />
          </div>

          <button
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded w-full disabled:bg-gray-600"
            disabled={splitFiles.length === 0 || processing}
            onClick={handleSplit}
          >
            Split PDF
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
            onClick={handleConvertToPdf}
          >
            Convert to PDF
          </button>
        </div>
      </div>
    </div>
  );
}
