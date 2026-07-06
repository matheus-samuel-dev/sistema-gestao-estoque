import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import { deleteAttachment, downloadAttachment, viewAttachment } from "../../services/productService";
import { getMovementAttachments, uploadMovementAttachment } from "../../services/stockMovementService";
import { getApiError } from "../../utils/formatters";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export default function MovementAttachmentsDialog({ movement, open, onClose, notify }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!movement) return;
    setLoading(true);
    setError("");
    try {
      setFiles(await getMovementAttachments(movement.id));
    } catch (e) {
      setError(getApiError(e, "Não foi possível carregar os anexos desta movimentação. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, movement]);

  const validateFile = (file) => {
    if (!file) return "Arquivo inválido.";
    if (file.size > MAX_FILE_SIZE) return "O arquivo selecionado ultrapassa o limite de 5MB.";
    if (!ALLOWED_TYPES.includes(file.type)) return "Tipo de arquivo não permitido. Use PDF, JPG, JPEG, PNG ou WEBP.";
    return "";
  };

  const upload = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      await uploadMovementAttachment(movement.id, file);
      notify("Anexo enviado com sucesso.");
      await load();
    } catch (e) {
      setError(getApiError(e, "Não foi possível anexar o arquivo. Verifique o formato e tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  const download = async (file) => {
    setError("");
    try {
      await downloadAttachment(file.id, file.fileName);
    } catch (e) {
      setError(getApiError(e, "Não foi possível baixar o anexo."));
    }
  };

  const view = async (file) => {
    setError("");
    try {
      await viewAttachment(file.id);
    } catch (e) {
      setError(getApiError(e, "Não foi possível visualizar este arquivo."));
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError("");
    try {
      await deleteAttachment(id);
      notify("Anexo removido.");
      await load();
    } catch (e) {
      setError(getApiError(e, "Não foi possível remover o anexo. Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Anexos da movimentação</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Button component="label" variant="outlined" startIcon={<AttachFileIcon />} disabled={loading}>
          Adicionar PDF ou imagem
          <input
            hidden
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) upload(file);
            }}
          />
        </Button>
        {loading && (
          <Box sx={{ display: "grid", placeItems: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        )}
        {!loading && !files.length && (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            Nenhum documento anexado.
          </Typography>
        )}
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              secondaryAction={(
                <>
                  <Tooltip title="Baixar">
                    <IconButton onClick={() => download(file)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  {file.contentType?.startsWith("image/") && (
                    <Tooltip title="Visualizar">
                      <IconButton onClick={() => view(file)}>
                        <AttachFileIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Excluir">
                    <IconButton color="error" onClick={() => remove(file.id)} disabled={loading}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            >
              <ListItemIcon><AttachFileIcon /></ListItemIcon>
              <ListItemText primary={file.fileName} secondary={`${(file.size / 1024).toFixed(1)} KB`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
