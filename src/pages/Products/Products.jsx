import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select,
  Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { createProduct, deleteProduct, getProducts, importProducts, updateProduct } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { getSuppliers } from "../../services/supplierService";
import { formatCurrency, getApiError } from "../../utils/formatters";
import ProductFormDialog from "../../components/Products/ProductFormDialog";
import ProductImportDialog from "../../components/Products/ProductImportDialog";
import ProductAttachmentsDialog from "../../components/Products/ProductAttachmentsDialog";
import ProductWithImage from "../../components/Common/ProductWithImage";

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [stock, setStock] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [attachments, setAttachments] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const notify = (message, severity = "success") => setToast({ open: true, message, severity });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productData, categoryData, supplierData] = await Promise.all([
        getProducts(),
        getCategories(),
        getSuppliers(),
      ]);
      setProducts(productData || []);
      setCategories(categoryData || []);
      setSuppliers(supplierData || []);
    } catch (error) {
      notify(getApiError(error, "Não foi possível carregar os produtos."), "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const activeCategories = categories.filter((item) => item.active !== false);
  const activeSuppliers = suppliers.filter((item) => item.active !== false);

  const filtered = useMemo(() => products.filter((product) => {
    const text = `${product.internalCode || ""} ${product.name} ${product.brand || ""} ${product.sku || ""}`.toLowerCase();
    const matchesStock = !stock || (
      stock === "OUT"
        ? product.quantity === 0
        : stock === "LOW"
          ? product.quantity > 0 && product.quantity <= product.minimumQuantity
          : product.quantity > product.minimumQuantity
    );
    return text.includes(query.trim().toLowerCase())
      && (!category || product.category?.id === category)
      && (!supplier || product.supplier?.id === supplier)
      && matchesStock;
  }), [products, query, category, supplier, stock]);

  const save = async (payload) => {
    setSaving(true);
    try {
      if (editing) await updateProduct(editing.id, payload);
      else await createProduct(payload);
      notify(editing ? "Produto atualizado com sucesso." : "Produto salvo com sucesso.");
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (error) {
      const fields = error.response?.data?.errors;
      notify(fields ? Object.values(fields)[0] : getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setSaving(true);
    try {
      await deleteProduct(deleting.id);
      notify("Produto excluído com sucesso.");
      setDeleting(null);
      await load();
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const runImport = async (items) => {
    setSaving(true);
    try {
      await importProducts(items);
      notify(`${items.length} produtos importados com sucesso.`);
      setImportOpen(false);
      await load();
    } catch (error) {
      notify(getApiError(error, "A importação não pôde ser concluída."), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 28, sm: 34 } }}>Produtos</Typography>
          <Typography color="text.secondary">Cadastre, localize e acompanhe os itens do seu inventário.</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", "& .MuiButton-root": { flex: { xs: "1 1 150px", sm: "0 0 auto" } } }}>
          <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setImportOpen(true)}>Importar produtos</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setFormOpen(true); }}>Novo produto</Button>
        </Box>
      </Box>

      {!loading && activeCategories.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }} action={<Button color="inherit" onClick={() => navigate("/categories")}>Cadastrar categoria</Button>}>
          Nenhuma categoria encontrada. Cadastre uma categoria antes de criar produtos.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(260px,1fr) 190px 190px 170px" }, gap: 1.5 }}>
          <TextField placeholder="Buscar por código, nome, SKU ou marca" value={query} onChange={(event) => setQuery(event.target.value)} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
          <FormControl><InputLabel>Categoria</InputLabel><Select value={category} label="Categoria" onChange={(event) => setCategory(event.target.value)}><MenuItem value="">Todas</MenuItem>{activeCategories.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}</Select></FormControl>
          <FormControl><InputLabel>Fornecedor</InputLabel><Select value={supplier} label="Fornecedor" onChange={(event) => setSupplier(event.target.value)}><MenuItem value="">Todos</MenuItem>{activeSuppliers.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}</Select></FormControl>
          <FormControl><InputLabel>Estoque</InputLabel><Select value={stock} label="Estoque" onChange={(event) => setStock(event.target.value)}><MenuItem value="">Todos</MenuItem><MenuItem value="OK">Regular</MenuItem><MenuItem value="LOW">Baixo</MenuItem><MenuItem value="OUT">Sem estoque</MenuItem></Select></FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><strong>Código</strong></TableCell>
              <TableCell><strong>Produto</strong></TableCell>
              <TableCell><strong>Categoria</strong></TableCell>
              <TableCell><strong>Fornecedor</strong></TableCell>
              <TableCell><strong>Marca</strong></TableCell>
              <TableCell align="right"><strong>Quantidade</strong></TableCell>
              <TableCell align="right"><strong>Valor</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>{Array.from({ length: 8 }).map((__, cell) => <TableCell key={cell}><Skeleton /></TableCell>)}</TableRow>
            ))}
            {!loading && filtered.map((product) => {
              const low = product.quantity <= product.minimumQuantity;
              return (
                <TableRow hover key={product.id}>
                  <TableCell>{product.internalCode || product.sku || "-"}</TableCell>
                  <TableCell>
                    <ProductWithImage
                      product={product}
                      complement={product.category?.name || product.model || product.physicalLocation || ""}
                    />
                  </TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell>{product.supplier?.name || "-"}</TableCell>
                  <TableCell>{product.brand || "-"}</TableCell>
                  <TableCell align="right"><Chip size="small" label={`${product.quantity} un.`} color={product.quantity === 0 ? "error" : low ? "warning" : "success"} /></TableCell>
                  <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Anexos"><IconButton onClick={() => setAttachments(product)}><AttachFileIcon /></IconButton></Tooltip>
                    <Tooltip title="Editar"><IconButton color="primary" onClick={() => { setEditing(product); setFormOpen(true); }}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Excluir"><IconButton color="error" onClick={() => setDeleting(product)}><DeleteOutlineIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {!loading && !filtered.length && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Box sx={{ py: 7, textAlign: "center" }}>
                    <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                    <Typography fontWeight={700}>Nenhum produto encontrado</Typography>
                    <Typography color="text.secondary">Ajuste os filtros ou cadastre o primeiro item.</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductFormDialog key={`${editing?.id || "new"}-${formOpen}`} open={formOpen} product={editing} categories={categories} suppliers={suppliers} loading={saving} onClose={() => setFormOpen(false)} onSave={save} />
      <ProductImportDialog open={importOpen} categories={categories} loading={saving} onClose={() => setImportOpen(false)} onImport={runImport} />
      <ProductAttachmentsDialog open={Boolean(attachments)} product={attachments} onClose={() => setAttachments(null)} notify={notify} onChanged={load} />

      <Dialog open={Boolean(deleting)} onClose={() => !saving && setDeleting(null)}>
        <DialogTitle>Excluir produto?</DialogTitle>
        <DialogContent>O produto <strong>{deleting?.name}</strong> será removido das listagens. Essa ação não apaga o histórico de movimentações.</DialogContent>
        <DialogActions><Button onClick={() => setDeleting(null)}>Cancelar</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>Excluir</Button></DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4500} onClose={() => setToast((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.severity} variant="filled" onClose={() => setToast((current) => ({ ...current, open: false }))}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
