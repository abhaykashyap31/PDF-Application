from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
from pathlib import Path
import datetime
import os

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, origins=["http://localhost:3000"])

# Get the absolute path of the current script's directory
BASE_DIR = Path(os.path.abspath(os.path.dirname(__file__)))

# Define absolute folder paths using pathlib
UPLOAD_FOLDER = BASE_DIR / "uploads"
BASE_PROCESSED_FOLDER = BASE_DIR / "processed"

# Ensure folders exist
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
BASE_PROCESSED_FOLDER.mkdir(parents=True, exist_ok=True)

# Merge PDFs
@app.route("/merge", methods=["POST"])
def merge_pdfs():
    if "files" not in request.files:
        return jsonify({"error": "No files part in the request"}), 400

    try:
        files = request.files.getlist("files")
        if not files:
            return jsonify({"error": "No files uploaded"}), 400

        merger = PdfWriter()

        for file in files:
            pdf_path = UPLOAD_FOLDER / file.filename
            file.save(pdf_path)
            merger.append(str(pdf_path))

        # Generate a unique folder name based on current date and time
        unique_folder_name = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        unique_folder_path = BASE_PROCESSED_FOLDER / unique_folder_name
        unique_folder_path.mkdir(parents=True, exist_ok=True)

        output_path = unique_folder_path / "merged.pdf"
        with open(output_path, "wb") as output_pdf:
            merger.write(output_pdf)
        merger.close()

        if not output_path.exists():
            return jsonify({"error": "Failed to create merged PDF"}), 500

        return send_file(str(output_path), as_attachment=True)

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Split PDF
@app.route("/split", methods=["POST"])
def split_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    try:
        file = request.files["file"]
        start_page = int(request.form["start_page"])
        end_page = int(request.form["end_page"])
    except (ValueError, KeyError):
        return jsonify({"error": "Invalid or missing start_page or end_page values"}), 400

    pdf_path = UPLOAD_FOLDER / file.filename
    file.save(pdf_path)
    
    try:
        reader = PdfReader(str(pdf_path))
        writer = PdfWriter()

        for page_num in range(start_page - 1, end_page):
            writer.add_page(reader.pages[page_num])

        output_path = BASE_PROCESSED_FOLDER / "split.pdf"
        with open(output_path, "wb") as output_pdf:
            writer.write(output_pdf)

        # Ensure file was created
        if not output_path.exists():
            return jsonify({"error": "Failed to create split PDF"}), 500

        return send_file(str(output_path), as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Convert Images to PDF
@app.route("/convert", methods=["POST"])
def convert_images_to_pdf():
    if "images" not in request.files:
        return jsonify({"error": "No images part in the request"}), 400

    files = request.files.getlist("images")
    if not files:
        return jsonify({"error": "No images uploaded"}), 400
    
    images = []

    try:
        for file in files:
            img_path = UPLOAD_FOLDER / file.filename
            file.save(img_path)
            images.append(Image.open(img_path).convert("RGB"))
        
        output_path = BASE_PROCESSED_FOLDER / "converted.pdf"
        images[0].save(str(output_path), save_all=True, append_images=images[1:])

        # Ensure file was created
        if not output_path.exists():
            return jsonify({"error": "Failed to create PDF from images"}), 500

        return send_file(str(output_path), as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)