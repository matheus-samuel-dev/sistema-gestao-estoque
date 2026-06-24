import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Paper, Snackbar, Switch, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { createSupplier, deleteSupplier, getSuppliers, setSupplierActive, updateSupplier } from "../../services/supplierService";
import { getApiError } from "../../utils/formatters";

const emptyForm = { name: "", document: "", phone: "", email: "", notes: "", active: true };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const notify = (message, severity = "success") => setToast({ open: true, message, severity });

  const load = useCallback(async () => {
    try {
      setSuppliers(await getSuppliers());
    } catch (error) {
      notify(getApiError(error, "Não foi possível carregar os fornecedores."), "error");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const edit = (supplier) => {
    setEditing(supplier);
    setForm({ ...emptyForm, ...supplier });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      notify("Nome do fornecedor é obrigatório.", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing) await updateSupplier(editing.id, form);
      else await createSupplier(form);
      notify(editing ? "Fornecedor atualizado." : "Fornecedor cadastrado.");
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (supplier) => {
    try {
      await setSupplierActive(supplier.id, !supplier.active);
      await load();
    } catch (error) {
      notify(getApiError(error), "error");
    }
  };

  const remove = async (supplier) => {
    if (!window.confirm(`Excluir fornecedor ${supplier.name}?`)) return;
    try {
      await deleteSupplier(supplier.id);
      notify("Fornecedor removido.");
      await load();
    } catch (error) {
      notify(getApiError(error), "error");
    }
  };

  const setValue = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 28, sm: 34 } }}>Fornecedores</Typography>
          <Typography color="text.secondary">Cadastre fornecedores para vincular aos produtos.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true); }}>Novo fornecedor</Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table sx={{ minWidth: 760 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Documento</strong></TableCell>
              <TableCell><strong>Contato</strong></TableCell>
              <TableCell><strong>Ativo</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id} hover>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.document || "-"}</TableCell>
                <TableCell>{supplier.email || supplier.phone || "-"}</TableCell>
                <TableCell><Switch checked={supplier.active !== false} onChange={() => toggle(supplier)} /></TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar"><IconButton color="primary" onClick={() => edit(supplier)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Excluir"><IconButton color="error" onClick={() => remove(supplier)}><DeleteIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {suppliers.length === 0 && (
              <TableRow><TableCell colSpan={5}><Box sx={{ py: 6, textAlign: "center" }}><Typography fontWeight={700}>Nenhum fornecedor cadastrado</Typography></Box></TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Editar fornecedor" : "Novo fornecedor"}</DialogTitle>
        <DialogContent dividers>
          <TextField fullWidth required label="Nome" value={form.name} onChange={setValue("name")} sx={{ mb: 2 }} />
          <TextField fullWidth label="CNPJ/CPF" value={form.document || ""} onChange={setValue("document")} sx={{ mb: 2 }} />
          <TextField fullWidth label="Telefone" value={form.phone || ""} onChange={setValue("phone")} sx={{ mb: 2 }} />
          <TextField fullWidth label="E-mail" value={form.email || ""} onChange={setValue("email")} sx={{ mb: 2 }} />
          <TextField fullWidth multiline minRows={2} label="Observações" value={form.notes || ""} onChange={setValue("notes")} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>Cancelar</Button>
          <Button variant="contained" onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((current) => ({ ...current, open: false }))}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
