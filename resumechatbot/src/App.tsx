import axios from "axios";
import { useRef, useState } from "react";
import { Upload } from "lucide-react"; // optional icon, install via: npm i lucide-react
import ResumeTable from "./components/ResumeTable";

function App() {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [resumeData, setResumeData] = useState<any>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://resumeocr-yuzi.onrender.com/resume/extract",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      setResumeData(response.data.extracted_data);
    } catch (err) {
      console.error(err);
      alert("File upload failed. Check the console for details.");
    } finally {
      setLoading(false);
      setIsDragging(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f9fafb",
        padding: "30px 10px",
      }}
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          width: "100%",
          maxWidth: "700px",
          border: `2px dashed ${isDragging ? "#2563eb" : "#cbd5e1"}`,
          background: isDragging ? "#eff6ff" : "#fff",
          borderRadius: "16px",
          padding: "60px 20px",
          textAlign: "center",
          transition: "all 0.3s ease",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Upload
          size={48}
          color={isDragging ? "#2563eb" : "#94a3b8"}
          style={{ marginBottom: "16px" }}
        />
        <p style={{ fontSize: "18px", color: "#334155", marginBottom: "8px" }}>
          {loading ? "Uploading..." : "Drag & drop your resume here"}
        </p>
        <p style={{ color: "#64748b" }}>or click to browse files (.pdf, .jpg, .png)</p>
        <input
          type="file"
          ref={fileRef}
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </div>

      {resumeData && (
        <div style={{ marginTop: "40px", width: "100%", maxWidth: "900px" }}>
          <ResumeTable data={resumeData} />
        </div>
      )}
    </div>
  );
}

export default App;
