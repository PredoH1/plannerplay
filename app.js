document
  .getElementById("inputExcel")
  .addEventListener("change", handleFile, false);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    // Supondo que você quer ler a primeira aba da planilha
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Converte a planilha para JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    displayTable(jsonData);
  };

  reader.readAsArrayBuffer(file);
}

function displayTable(data) {
  const tableHeader = document.getElementById("tableHeader");
  const tableBody = document.getElementById("tableBody");

  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";

  // Cria o cabeçalho da tabela
  const headerRow = document.createElement("tr");
  data[0].forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  tableHeader.appendChild(headerRow);

  // Cria as linhas da tabela
  data.slice(1).forEach((rowData) => {
    const row = document.createElement("tr");
    rowData.forEach((cellData) => {
      const cell = document.createElement("td");
      cell.textContent = cellData;
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}
