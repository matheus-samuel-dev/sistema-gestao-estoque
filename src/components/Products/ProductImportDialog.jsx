import { useMemo, useState } from "react";
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Paper, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";

const columns = ["Código", "Nome", "Categoria", "Marca", "Valor Unitário", "Quantidade", "Estoque Mínimo", "Origem", "Localização", "Observações"];
const originMap = {
  COMPRA: "PURCHASE", PURCHASE: "PURCHASE", "DOAÇÃO": "DONATION", DOACAO: "DONATION", DONATION: "DONATION",
  "TRANSFERÊNCIA": "TRANSFER", TRANSFERENCIA: "TRANSFER", TRANSFER: "TRANSFER",
  "PRODUÇÃO INTERNA": "INTERNAL_PRODUCTION", INTERNAL_PRODUCTION: "INTERNAL_PRODUCTION",
  "AJUSTE DE ESTOQUE": "STOCK_ADJUSTMENT", STOCK_ADJUSTMENT: "STOCK_ADJUSTMENT", OUTRO: "OTHER", OTHER: "OTHER",
};

async function loadSpreadsheetTools() {
  const [XLSX, fileSaver] = await Promise.all([
    import("xlsx"),
    import("file-saver"),
  ]);
  const saveAs = fileSaver.saveAs || fileSaver.default?.saveAs || fileSaver.default;
  return { XLSX, saveAs };
}

export default function ProductImportDialog({ open, categories, loading, onClose, onImport }) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const activeCategories = useMemo(() => categories.filter((item) => item.active !== false), [categories]);

  const mapped = useMemo(() => rows.map((row, index) => {
    const category = activeCategories.find((item) => item.name.toLowerCase() === String(row.Categoria || "").trim().toLowerCase());
    const errors = [];
    if (!String(row.Nome || "").trim()) errors.push("Nome obrigatório");
    if (!category) errors.push("Categoria não encontrada");
    if (Number(row["Valor Unitário"]) < 0 || row["Valor Unitário"] === undefined) errors.push("Valor inválido");
    if (Number(row.Quantidade) < 0 || row.Quantidade === undefined) errors.push("Quantidade inválida");
    return {
      line: index + 2, errors,
      payload: {
        name: String(row.Nome || "").trim(), internalCode: String(row.Código || "").trim() || null,
        brand: String(row.Marca || "").trim() || null, categoryId: category?.id,
        price: Number(row["Valor Unitário"] || 0), quantity: Number(row.Quantidade || 0),
        minimumQuantity: Number(row["Estoque Mínimo"] || 0), origin: originMap[String(row.Origem || "OTHER").trim().toUpperCase()] || "OTHER",
        physicalLocation: String(row.Localização || "").trim() || null, notes: String(row.Observações || "").trim() || null,
      },
    };
  }), [rows, activeCategories]);
  const invalid = mapped.filter((row) => row.errors.length > 0);
  const step = rows.length ? (invalid.length ? 2 : 3) : 0;

  const readFile = async (file) => {
    const { XLSX } = await loadSpreadsheetTools();
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    setRows(XLSX.utils.sheet_to_json(sheet, { defval: "" }));
    setFileName(file.name);
  };

  const downloadTemplate = async () => {
    const { XLSX, saveAs } = await loadSpreadsheetTools();
    const sheet = XLSX.utils.json_to_sheet([{ Código: "PROD-001", Nome: "Produto exemplo", Categoria: activeCategories[0]?.name || "Informática", Marca: "", "Valor Unitário": 99.9, Quantidade: 10, "Estoque Mínimo": 2, Origem: "PURCHASE", Localização: "", Observações: "" }], { header: columns });
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, sheet, "Produtos");
    saveAs(new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })]), "modelo-importacao-produtos.xlsx");
  };

  const close = () => { setRows([]); setFileName(""); onClose(); };
  return (
    <Dialog open={open} onClose={loading ? undefined : close} fullWidth maxWidth="lg">
      <DialogTitle><Typography variant="h6" fontWeight={800}>Importar produtos</Typography></DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>{["Upload", "Pré-visualização", "Validação", "Importação"].map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}</Stepper>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        {!rows.length ? (
          <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderStyle: "dashed" }}>
            <UploadFileIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h6" fontWeight={700}>Selecione uma planilha CSV ou XLSX</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Até 500 produtos. Os dados serão validados antes da confirmação.</Typography>
            <Button component="label" variant="contained" startIcon={<UploadFileIcon />}>Escolher arquivo<input hidden type="file" accept=".csv,.xlsx,.xls" onChange={(event) => event.target.files?.[0] && readFile(event.target.files[0])} /></Button>
            <Button onClick={downloadTemplate} startIcon={<DownloadIcon />} sx={{ ml: { sm: 1 }, mt: { xs: 1, sm: 0 } }}>Baixar modelo</Button>
          </Paper>
        ) : (
          <>
            <Alert severity={invalid.length ? "error" : "success"} sx={{ mb: 2 }}>
              {invalid.length ? `${invalid.length} linha(s) precisam de correção. Baixe ou ajuste a planilha e envie novamente.` : `${mapped.length} produtos prontos para importar.`} Arquivo: {fileName}
            </Alert>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 420 }}><Table stickyHeader size="small" sx={{ minWidth: 780 }}><TableHead><TableRow><TableCell>Linha</TableCell><TableCell>Código</TableCell><TableCell>Nome</TableCell><TableCell>Categoria</TableCell><TableCell>Quantidade</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>
              {mapped.map((item) => <TableRow key={item.line}><TableCell>{item.line}</TableCell><TableCell>{item.payload.internalCode || "-"}</TableCell><TableCell>{item.payload.name || "-"}</TableCell><TableCell>{rows[item.line - 2].Categoria || "-"}</TableCell><TableCell>{item.payload.quantity}</TableCell><TableCell><Chip size="small" color={item.errors.length ? "error" : "success"} label={item.errors.join(", ") || "Válida"} /></TableCell></TableRow>)}
            </TableBody></Table></TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions><Button onClick={rows.length ? () => { setRows([]); setFileName(""); } : close}>{rows.length ? "Trocar arquivo" : "Cancelar"}</Button>{rows.length > 0 && <Button variant="contained" disabled={loading || invalid.length > 0} onClick={() => onImport(mapped.map((item) => item.payload))}>Importar {mapped.length} produtos</Button>}</DialogActions>
    </Dialog>
  );
}
