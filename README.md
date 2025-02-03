# PDF-Application

## 📌 Overview
PDF-Application is a lightweight and efficient tool for managing PDFs. It allows users to:

✅ Merge multiple PDFs into one.
✅ Split PDFs into individual pages.
✅ Convert images to PDFs.

With an intuitive interface and powerful backend, this application simplifies document management with just a few clicks.

---

## 📂 Project Structure
```
PDF-Application/
│── Frontend/             # Contains UI components (if applicable)
│── Backend/              # Handles all backend operations
│   │── logics/           # Core logic for PDF processing
│   │   │── uploads/      # Stores uploaded files
│   │   │── processed/    # Stores processed files
│   │── pdfconverter.py   # Main script handling all PDF operations
│── docs/                 # Documentation and GIFs for reference
│── README.md             # Project documentation
```

---

## 🛠️ Tech Stack
- **Flask** - Web framework for the backend
- **PyPDF** - PDF processing library
- **Pillow** - Image processing for converting images to PDFs
- **pathlib & os** - File system management

---

## 🚀 Features
🔹 **Merge PDFs** - Combine multiple PDF files into a single document.  
🔹 **Split PDFs** - Extract pages from a PDF and save them separately.  
🔹 **Image to PDF** - Convert PNG, JPEG, and other image formats into a PDF.  
🔹 **File Management** - Upload, process, and store files efficiently.

---

## 🏗️ Installation & Setup
### 🔽 Prerequisites
Ensure you have **Python 3.8+** installed.

### 🔧 Installation Steps
```bash
# Clone the repository
git clone https://github.com/yourusername/pdf-application.git
cd pdf-application

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
```

---

## 🏃 Usage
### Running the Application
```bash
python backend/logics/pdfconverter.py
```
This will start the Flask backend, allowing you to interact with the API or UI.

---

## 📸 Documentation & Demos
Find GIFs and documentation in the `docs/` folder to better understand how the application works.

---

## 📝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 🔗 License
This project is not licensed.

Happy Coding! 🚀

