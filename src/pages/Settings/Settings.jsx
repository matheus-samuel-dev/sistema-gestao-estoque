import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CompanyLogo from "../../components/Common/CompanyLogo";
import { getSettings, updateSettings } from "../../services/settingsService";
import { BUSINESS_TYPES, getSuggestedCategories } from "../../utils/businessCategories";
import { getApiError } from "../../utils/formatters";
import {
  formatCnpj,
  formatPhone,
  isValidCnpj,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  onlyDigits,
} from "../../utils/validators";

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

const fieldLabels = {
  companyName: "Nome da empresa",
  logoUrl: "URL da logo",
  cnpj: "CNPJ",
  phone: "Telefone",
  email: "E-mail",
  defaultMinimumStock: "Estoque mínimo padrão",
  timezone: "Timezone",
  dateFormat: "Formato de data",
};

function normalizeSettings(data) {
  return {
    ...defaults,
    ...data,
    companyName: data?.companyName || "",
    logoUrl: data?.logoUrl || "",
    cnpj: data?.cnpj ? formatCnpj(data.cnpj) : "",
    phone: data?.phone ? formatPhone(data.phone) : "",
    email: data?.email || "",
  };
}

function validateForm(values) {
  const errors = {};
  const companyName = values.companyName.trim().replace(/\s+/g, " ");

  if (!companyName) {
    errors.companyName = "Campo obrigatório.";
  } else if (companyName.length < 3) {
    errors.companyName = "Informe pelo menos 3 caracteres.";
  }

  if (values.cnpj && !isValidCnpj(values.cnpj)) {
    errors.cnpj = "Informe um CNPJ válido.";
  }

  if (values.phone && !isValidPhone(values.phone)) {
    errors.phone = "Informe um telefone válido.";
  }

  if (values.email && !isValidEmail(values.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (values.logoUrl && !isValidUrl(values.logoUrl)) {
    errors.logoUrl = "Informe uma URL válida.";
  }

  if (Number(values.defaultMinimumStock) < 0) {
    errors.defaultMinimumStock = "Informe um valor maior ou igual a zero.";
  }

  if (!values.timezone.trim()) {
    errors.timezone = "Campo obrigatório.";
  }

  if (!values.dateFormat.trim()) {
    errors.dateFormat = "Campo obrigatório.";
  }

  return errors;
}

export default function Settings() {
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const refs = useRef({});

  const suggestedCategories = useMemo(
    () => getSuggestedCategories(form.businessType || "Outro"),
    [form.businessType]
  );

  const notify = (message, severity = "success") => setToast({ open: true, message, severity });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        const nextForm = normalizeSettings(data);
        setForm(nextForm);
        setErrors(validateForm(nextForm));
      } catch (error) {
        notify(getApiError(error, "Não foi possível carregar as configurações."), "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const focusFirstError = (nextErrors) => {
    const firstField = Object.keys(nextErrors)[0];
    if (firstField) {
      refs.current[firstField]?.focus();
    }
  };

  const setField = (field, value) => {
    setForm((current) => {
      const nextForm = { ...current, [field]: value };
      setErrors(validateForm(nextForm));
      return nextForm;
    });
  };

  const setValue = (field) => (event) => setField(field, event.target.value);
  const setChecked = (field) => (event) => setField(field, event.target.checked);
  const touch = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const helper = (field, validMessage = "") => {
    const value = String(form[field] ?? "").trim();
    const showError = Boolean(touched[field] && errors[field]);
    const showSuccess = Boolean(value && !errors[field] && validMessage);

    return {
      error: showError,
      helperText: showError ? errors[field] : showSuccess ? validMessage : " ",
      slotProps: {
        formHelperText: {
          sx: showSuccess ? { color: "success.main", fontWeight: 700 } : undefined,
        },
      },
    };
  };

  const save = async () => {
    const nextForm = {
      ...form,
      companyName: form.companyName.trim().replace(/\s+/g, " "),
      email: form.email.trim(),
      logoUrl: form.logoUrl.trim(),
      cnpj: formatCnpj(form.cnpj),
      phone: formatPhone(form.phone),
    };
    const nextErrors = validateForm(nextForm);
    setForm(nextForm);
    setErrors(nextErrors);
    setTouched(Object.keys(fieldLabels).reduce((fields, field) => ({ ...fields, [field]: true }), {}));

    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0];
      notify(`${fieldLabels[firstField]}: ${nextErrors[firstField]}`, "error");
      focusFirstError(nextErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...nextForm,
        cnpj: onlyDigits(nextForm.cnpj),
        phone: onlyDigits(nextForm.phone),
        defaultMinimumStock: Number(nextForm.defaultMinimumStock || 0),
      };
      const data = await updateSettings(payload);
      const savedForm = normalizeSettings(data);
      setForm(savedForm);
      setErrors(validateForm(savedForm));
      window.dispatchEvent(new Event("settings:updated"));
      notify("Configurações salvas com sucesso.");
    } catch (error) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors((current) => ({ ...current, ...backendErrors }));
        setTouched((current) => ({
          ...current,
          ...Object.keys(backendErrors).reduce((fields, field) => ({ ...fields, [field]: true }), {}),
        }));
        focusFirstError(backendErrors);
      }
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
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <CompanyLogo companyName={form.companyName} logoUrl={isValidUrl(form.logoUrl) ? form.logoUrl : ""} size={64} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" fontWeight={800}>Empresa</Typography>
                <Typography variant="body2" color="text.secondary">
                  A logo usa a imagem da URL ou gera iniciais automaticamente.
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              required
              label="Nome da empresa"
              placeholder="Ex.: Rede Líder"
              value={form.companyName}
              onChange={setValue("companyName")}
              onBlur={touch("companyName")}
              inputRef={(element) => { refs.current.companyName = element; }}
              sx={{ mb: 1.25 }}
              {...helper("companyName", "✓ Nome válido")}
            />

            <TextField
              fullWidth
              label="Logo (URL)"
              placeholder="https://minhaempresa.com/logo.png"
              value={form.logoUrl}
              onChange={setValue("logoUrl")}
              onBlur={touch("logoUrl")}
              inputRef={(element) => { refs.current.logoUrl = element; }}
              sx={{ mb: 1.25 }}
              {...helper("logoUrl", "✓ URL válida")}
            />

            <TextField
              fullWidth
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={(event) => setField("cnpj", formatCnpj(event.target.value))}
              onBlur={touch("cnpj")}
              inputRef={(element) => { refs.current.cnpj = element; }}
              sx={{ mb: 1.25 }}
              {...helper("cnpj", "✓ CNPJ válido")}
            />

            <TextField
              fullWidth
              label="Telefone"
              placeholder="(11) 99999-9999"
              value={form.phone}
              onChange={(event) => setField("phone", formatPhone(event.target.value))}
              onBlur={touch("phone")}
              inputRef={(element) => { refs.current.phone = element; }}
              sx={{ mb: 1.25 }}
              {...helper("phone", "✓ Telefone válido")}
            />

            <TextField
              fullWidth
              label="E-mail"
              placeholder="contato@empresa.com"
              value={form.email}
              onChange={setValue("email")}
              onBlur={touch("email")}
              inputRef={(element) => { refs.current.email = element; }}
              {...helper("email", "✓ E-mail válido")}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>Estoque</Typography>
            <TextField
              fullWidth
              type="number"
              label="Estoque mínimo padrão"
              value={form.defaultMinimumStock ?? 0}
              onChange={setValue("defaultMinimumStock")}
              onBlur={touch("defaultMinimumStock")}
              inputRef={(element) => { refs.current.defaultMinimumStock = element; }}
              sx={{ mb: 1.25 }}
              slotProps={{ htmlInput: { min: 0 } }}
              {...helper("defaultMinimumStock")}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de negócio</InputLabel>
              <Select value={form.businessType || "Outro"} label="Tipo de negócio" onChange={setValue("businessType")}>
                {BUSINESS_TYPES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
              </Select>
              <FormHelperText>As categorias sugeridas mudam conforme o segmento escolhido.</FormHelperText>
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={800}>Categorias sugeridas</Typography>
              <Tooltip title="Essas categorias são usadas na configuração inicial para evitar segmentos incorretos.">
                <InfoOutlinedIcon fontSize="small" color="action" />
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {suggestedCategories.map((category) => (
                <Chip key={category} label={category} size="small" color="primary" variant="outlined" />
              ))}
            </Box>

            <FormControlLabel control={<Switch checked={Boolean(form.batchControl)} onChange={setChecked("batchControl")} />} label="Controle por lote" />
            <FormControlLabel control={<Switch checked={Boolean(form.serialControl)} onChange={setChecked("serialControl")} />} label="Controle por serial" />
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>Sistema</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Moeda</InputLabel>
              <Select value={form.currency || "BRL"} label="Moeda" onChange={setValue("currency")}>
                <MenuItem value="BRL">BRL - Real brasileiro</MenuItem>
                <MenuItem value="USD">USD - Dólar</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              label="Timezone"
              value={form.timezone || ""}
              onChange={setValue("timezone")}
              onBlur={touch("timezone")}
              inputRef={(element) => { refs.current.timezone = element; }}
              sx={{ mb: 1.25 }}
              {...helper("timezone")}
            />
            <TextField
              fullWidth
              required
              label="Formato de data"
              value={form.dateFormat || ""}
              onChange={setValue("dateFormat")}
              onBlur={touch("dateFormat")}
              inputRef={(element) => { refs.current.dateFormat = element; }}
              {...helper("dateFormat")}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={save} disabled={saving || loading}>
          {saving ? "Salvando..." : "Salvar configurações"}
        </Button>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast((current) => ({ ...current, open: false }))}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
