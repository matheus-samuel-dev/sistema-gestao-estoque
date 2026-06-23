import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Paper, Skeleton, Snackbar, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { createCategory, deleteCategory, getCategories, setCategoryActive, updateCategory } from "../../services/categoryService";
import { getApiError } from "../../utils/formatters";

export default function Categories() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState(""); const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null); const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" }); const [touched, setTouched] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const notify = (message, severity = "success") => setToast({ open: true, message, severity });
  const load = useCallback(async () => { setLoading(true); try { setItems(await getCategories()); } catch (e) { notify(getApiError(e), "error"); } finally { setLoading(false); } }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);
  const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.description || ""}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const openForm = (category = null) => { setEditing(category); setForm({ name: category?.name || "", description: category?.description || "" }); setTouched(false); setOpen(true); };
  const save = async () => { setTouched(true); if (form.name.trim().length < 3) return; setSaving(true); try { if (editing) await updateCategory(editing.id, form); else await createCategory(form); notify(editing ? "Categoria atualizada." : "Categoria criada com sucesso."); setOpen(false); await load(); } catch (e) { notify(getApiError(e), "error"); } finally { setSaving(false); } };
  const toggle = async (item) => { try { await setCategoryActive(item.id, !item.active); notify(item.active ? "Categoria desativada." : "Categoria ativada."); await load(); } catch (e) { notify(getApiError(e), "error"); } };
  const remove = async () => { setSaving(true); try { await deleteCategory(deleting.id); notify("Categoria excluída."); setDeleting(null); await load(); } catch (e) { notify(getApiError(e), "error"); } finally { setSaving(false); } };

  return <Box sx={{ minWidth: 0 }}>
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, gap: 2, mb: 3 }}>
      <Box><Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 28, sm: 34 } }}>Categorias</Typography><Typography color="text.secondary">Estruture o catálogo sem limitar o tipo de inventário.</Typography></Box>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm()}>Nova categoria</Button>
    </Box>
    <TextField fullWidth placeholder="Buscar categoria" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ mb: 2, bgcolor: "white" }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: "auto" }}><Table sx={{ minWidth: 650 }}><TableHead sx={{ bgcolor: "#f8fafc" }}><TableRow><TableCell><strong>Categoria</strong></TableCell><TableCell><strong>Descrição</strong></TableCell><TableCell><strong>Status</strong></TableCell><TableCell align="right"><strong>Ações</strong></TableCell></TableRow></TableHead><TableBody>
      {loading && Array.from({ length: 6 }).map((_, index) => <TableRow key={index}>{Array.from({ length: 4 }).map((__, cell) => <TableCell key={cell}><Skeleton /></TableCell>)}</TableRow>)}
      {!loading && filtered.map((item) => <TableRow hover key={item.id}><TableCell><Typography fontWeight={700}>{item.name}</Typography></TableCell><TableCell>{item.description || "Sem descrição"}</TableCell><TableCell><Chip size="small" label={item.active === false ? "Inativa" : "Ativa"} color={item.active === false ? "default" : "success"} /></TableCell><TableCell align="right"><Tooltip title={item.active === false ? "Ativar" : "Desativar"}><Switch checked={item.active !== false} onChange={() => toggle(item)} /></Tooltip><Tooltip title="Editar"><IconButton color="primary" onClick={() => openForm(item)}><EditIcon /></IconButton></Tooltip><Tooltip title="Excluir"><IconButton color="error" onClick={() => setDeleting(item)}><DeleteOutlineIcon /></IconButton></Tooltip></TableCell></TableRow>)}
      {!loading && !filtered.length && <TableRow><TableCell colSpan={4}><Box sx={{ py: 7, textAlign: "center" }}><CategoryOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} /><Typography fontWeight={700}>Nenhuma categoria encontrada</Typography><Typography color="text.secondary">Crie uma categoria para organizar seus produtos.</Typography></Box></TableCell></TableRow>}
    </TableBody></Table></TableContainer>
    <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="sm"><DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle><DialogContent dividers><TextField autoFocus fullWidth required label="Nome" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} onBlur={() => setTouched(true)} error={touched && form.name.trim().length < 3} helperText={touched && form.name.trim().length < 3 ? "Informe um nome com pelo menos 3 caracteres." : ""} sx={{ mb: 2 }} /><TextField fullWidth multiline minRows={3} label="Descrição" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} /></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancelar</Button><Button variant="contained" onClick={save} disabled={saving || form.name.trim().length < 3}>{saving ? "Salvando..." : "Salvar"}</Button></DialogActions></Dialog>
    <Dialog open={Boolean(deleting)} onClose={() => !saving && setDeleting(null)}><DialogTitle>Excluir categoria?</DialogTitle><DialogContent>Confirme a exclusão de <strong>{deleting?.name}</strong>. Categorias com produtos devem ser desativadas em vez de excluídas.</DialogContent><DialogActions><Button onClick={() => setDeleting(null)}>Cancelar</Button><Button color="error" variant="contained" onClick={remove} disabled={saving}>Excluir</Button></DialogActions></Dialog>
    <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}><Alert variant="filled" severity={toast.severity}>{toast.message}</Alert></Snackbar>
  </Box>;
}
