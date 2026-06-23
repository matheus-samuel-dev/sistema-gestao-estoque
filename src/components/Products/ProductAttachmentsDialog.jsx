import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import { deleteAttachment, downloadAttachment, getProductAttachments, uploadProductAttachment } from "../../services/productService";
import { getApiError } from "../../utils/formatters";

export default function ProductAttachmentsDialog({ product, open, onClose, notify }) {
  const [files, setFiles] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const load = async () => { if (!product) return; setLoading(true); try { setFiles(await getProductAttachments(product.id)); } catch (e) { setError(getApiError(e)); } finally { setLoading(false); } };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);
  const upload = async (file) => { setLoading(true); setError(""); try { await uploadProductAttachment(product.id, file); notify("Anexo enviado com sucesso."); await load(); } catch (e) { setError(getApiError(e)); } finally { setLoading(false); } };
  const remove = async (id) => { setLoading(true); try { await deleteAttachment(id); notify("Anexo removido."); await load(); } catch (e) { setError(getApiError(e)); } finally { setLoading(false); } };
  return <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm"><DialogTitle>Anexos de {product?.name}</DialogTitle><DialogContent dividers>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Button component="label" variant="outlined" startIcon={<AttachFileIcon />} disabled={loading}>Adicionar PDF ou imagem<input hidden type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} /></Button>
    {loading && <Box sx={{ display: "grid", placeItems: "center", py: 3 }}><CircularProgress size={28} /></Box>}
    {!loading && !files.length && <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>Nenhum documento anexado.</Typography>}
    <List>{files.map((file) => <ListItem key={file.id} secondaryAction={<><Tooltip title="Baixar"><IconButton onClick={() => downloadAttachment(file.id, file.fileName)}><DownloadIcon /></IconButton></Tooltip><Tooltip title="Excluir"><IconButton color="error" onClick={() => remove(file.id)}><DeleteOutlineIcon /></IconButton></Tooltip></>}><ListItemIcon><AttachFileIcon /></ListItemIcon><ListItemText primary={file.fileName} secondary={`${(file.size / 1024).toFixed(1)} KB`} /></ListItem>)}</List>
  </DialogContent><DialogActions><Button onClick={onClose}>Fechar</Button></DialogActions></Dialog>;
}
