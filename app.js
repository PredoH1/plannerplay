document
  .getElementById("inputExcel")
  .addEventListener("change", handleFile, false);

function handleFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Calcula o rendimento dos funcionários e exibe os dados
    calculatePerformance(jsonData);
  };

  reader.readAsArrayBuffer(file);
}

function calculatePerformance(data) {
  const tableHeader = document.getElementById("tableHeader");
  const tableBody = document.getElementById("tableBody");
  const employeePerformance = document.getElementById("employeePerformance"); // Para exibir rendimento

  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";
  employeePerformance.innerHTML = ""; // Limpa os dados anteriores

  const headerRow = document.createElement("tr");
  const headers = [
    "Nome",
    "Horas Trabalhadas",
    "Custo por Hora",
    "Receita Gerada",
    "Custo Total",
    "Rendimento (%)",
  ];

  headers.forEach((headerText) => {
    const headerCell = document.createElement("th");
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  tableHeader.appendChild(headerRow);

  data.slice(1).forEach((rowData) => {
    const row = document.createElement("tr");

    const nome = rowData[0];
    const horasTrabalhadas = parseFloat(rowData[1]);
    const custoPorHora = parseFloat(rowData[2]);
    const receitaGerada = parseFloat(rowData[3]);

    const custoTotal = horasTrabalhadas * custoPorHora;
    const rendimento = ((receitaGerada - custoTotal) / custoTotal) * 100;

    const rowElements = [
      nome,
      horasTrabalhadas,
      custoPorHora,
      receitaGerada,
      custoTotal.toFixed(2),
      rendimento.toFixed(2) + "%",
    ];

    rowElements.forEach((cellData) => {
      const cell = document.createElement("td");
      cell.textContent = cellData;
      row.appendChild(cell);
    });

    tableBody.appendChild(row);

    // Exibe o rendimento de cada funcionário separadamente abaixo da tabela
    const performanceText = document.createElement("p");
    performanceText.textContent = `Funcionário: ${nome}, Rendimento: ${rendimento.toFixed(
      2
    )}%`;
    employeePerformance.appendChild(performanceText);
  });
}
