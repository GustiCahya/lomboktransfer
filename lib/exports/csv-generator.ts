/**
 * CSV Generator Utility
 * Converts an array of objects to a downloadable CSV file
 */
export function generateCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diexport.");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.join(","));

  // Data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      const str = val === null || val === undefined ? "" : String(val);
      // Escape commas and quotes
      const escaped = str.replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
