import React, { useEffect, useState } from "react";

function ResumeTable({ data }: { data: any }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!data) return;

    const total = 11; // total number of rows
    setVisibleCount(0);

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= total) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [data]);

  const bubbleStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    opacity: 0,
    transform: "translateY(20px)",
    transition: "opacity 0.5s ease, transform 0.5s ease",

  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    width: "30%",
    color: "#333",
  };

  const valueStyle: React.CSSProperties = {
    flex: 1,
    color: "#555",
  };

  if (!data) return <p>No data available</p>;

  const rows = [
    ["Full Name", data.full_name],
    ["Email", data.email],
    ["Phone Number", data.phone_number],
    ["Location", data.location],
    ["Skills", data.skills?.join(", ")],
    ["Experience", data.experience_years],
    [
      "Education",
      <ul style={{ margin: 0, paddingLeft: "18px" }}>
        {data.education?.map((edu: string, i: number) => (
          <li key={i}>{edu}</li>
        ))}
      </ul>,
    ],
    ["Current Job", data.current_job],
    [
      "Companies Worked At",
      <ul style={{ margin: 0, paddingLeft: "18px" }}>
        {data.companies_worked_at?.map((c: string, i: number) => (
          <li key={i}>{c}</li>
        ))}
      </ul>,
    ],
    [
      "LinkedIn",
      <a href={`https://${data.linkedin}`} target="_blank" rel="noreferrer">
        {data.linkedin}
      </a>,
    ],
    [
      "Certifications",
      <ul style={{ margin: 0, paddingLeft: "18px" }}>
        {data.certifications?.map((c: string, i: number) => (
          <li key={i}>{c}</li>
        ))}
      </ul>,
    ],
  ];

  return (
    <div style={{ margin: "30px auto", maxWidth: "900px" }}>
      <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Resume Data</h2>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            ...bubbleStyle,
            opacity: i < visibleCount ? 1 : 0,
            transform:
              i < visibleCount ? "translateY(0)" : "translateY(30px)",
            transitionDelay: `${i * 0.1}s`, // add stagger delay
          }}
        >
          <div style={labelStyle}>{r[0]}</div>
          <div style={valueStyle}>{r[1]}</div>
        </div>
      ))}
    </div>
  );
}

export default ResumeTable;
