import { useEffect, useState } from "react";
import {
  Alert, Box, Button, FormControl, FormControlLabel, Grid, InputLabel,
  MenuItem, Paper, Select, Snackbar, Switch, TextField, Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { getSettings, updateSettings } from "../../services/settingsService";
import { getApiError } from "../../utils/formatters";

const defaults = {
  companyName: "",
  logoUrl: "",
  cnpj: "",
  phone: "",
  email: "",
  defaultMinimumStock: 0,
  businessType: "Outro",
  batchControl: false,
  serialControl: false,
  currency: "BRL",
  timezone: "America/Sao_Paulo",
  dateFormat: "dd/MM/yyyy",
  onboardingCompleted: false,
};

export default function Settings() {
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const notify = (message, severity = "success") => setToast({ open: true, message, severity });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setForm({ ...defaults, ...data });
      } catch (error) {
        notify(getApiError(error, "Não foi possível carregar as configurações."), "error");
      }
    };
    load();
  }, []);

  const setValue = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const setChecked = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.checked }));

  const save = async () => {
    setSaving(true);
    try {
      const data = await updateSettings({ ...form, defaultMinimumStock: Number(form.defaultMinimumStock || 0) });
      setForm({ ...defaults, ...data });
      notify("Configurações salvas com sucesso.");
    } catch (error) {
      notify(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 28, sm: 34 } }}>Configurações</Typography>
        <Typography color="text.secondary">Personalize empresa, regras de estoque e preferências do sistema.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>Empresa</Typography>
            <TextField fullWidth label="Nome da empresa" value={form.companyName || ""} onChange={setValue("companyName")} sx={{ mb: 2 }} />
            <TextField fullWidth label="Logo (URL)" value={form.logoUrl || ""} onChange={setValue("logoUrl")} sx={{ mb: 2 }} />
            <TextField fullWidth label="CNPJ" value={form.cnpj || ""} onChange={setValue("cnpj")} sx={{ mb: 2 }} />
            <TextField fullWidth label="Telefone" value={form.phone || ""} onChange={setValue("phone")} sx={{ mb: 2 }} />
            <TextField fullWidth label="E-mail" value={form.email || ""} onChange={setValue("email")} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>Estoque</Typography>
            <TextField fullWidth type="number" label="Estoque mínimo padrão" value={form.defaultMinimumStock ?? 0} onChange={setValue("defaultMinimumStock")} sx={{ mb: 2 }} slotProps={{ htmlInput: { min: 0 } }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de negócio</InputLabel>
              <Select value={form.businessType || "Outro"} label="Tipo de negócio" onChange={setValue("businessType")}>
                {["Loja", "Assistência técnica", "Distribuidora", "Mercado", "Farmácia", "Outro"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControlLabel control={<Switch checked={Boolean(form.batchControl)} onChange={setChecked("batchControl")} />} label="Controle por lote" />
            <FormControlLabel control={<Switch checked={Boolean(form.serialControl)} onChange={setChecked("serialControl")} />} label="Controle por serial" />
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>Sistema</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Moeda</InputLabel>
              <Select value={form.currency || "BRL"} label="Moeda" onChange={setValue("currency")}>
                <MenuItem value="BRL">BRL - Real brasileiro</MenuItem>
                <MenuItem value="USD">USD - Dólar</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Timezone" value={form.timezone || ""} onChange={setValue("timezone")} sx={{ mb: 2 }} />
            <TextField fullWidth label="Formato de data" value={form.dateFormat || ""} onChange={setValue("dateFormat")} />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar configurações"}</Button>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((current) => ({ ...current, open: false }))}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
