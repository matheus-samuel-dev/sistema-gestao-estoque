import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../services/categoryService";
import { createSupplier } from "../../services/supplierService";
import { finishOnboarding, updateSettings } from "../../services/settingsService";
import { BUSINESS_TYPES, getSuggestedCategories } from "../../utils/businessCategories";
import { getApiError } from "../../utils/formatters";

const steps = ["Tipo de negócio", "Categorias", "Fornecedor", "Produto", "Finalizar"];

const categoriesToText = (businessType) => getSuggestedCategories(businessType).join(", ");

const parseCategories = (value) => (
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, list) => list.findIndex((other) => other.toLowerCase() === item.toLowerCase()) === index)
);

export default function OnboardingDialog({ open, onDone }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [businessType, setBusinessType] = useState("Loja");
  const [categories, setCategories] = useState(categoriesToText("Loja"));
  const [supplier, setSupplier] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeBusinessType = (event) => {
    const nextBusinessType = event.target.value;
    setBusinessType(nextBusinessType);
    setCategories(categoriesToText(nextBusinessType));
  };

  const next = async () => {
    setError("");
    setLoading(true);
    try {
      if (activeStep === 0) {
        await updateSettings({ businessType, onboardingCompleted: false });
      }

      if (activeStep === 1) {
        const selectedCategories = parseCategories(categories);
        if (!selectedCategories.length) {
          throw new Error("Informe pelo menos uma categoria inicial.");
        }
        await Promise.all(
          selectedCategories.map((name) => createCategory({ name, description: "Categoria inicial" }).catch(() => null))
        );
      }

      if (activeStep === 2 && supplier.name.trim()) {
        await createSupplier(supplier);
      }

      if (activeStep === 3) {
        navigate("/products");
      }

      if (activeStep === 4) {
        await finishOnboarding();
        onDone();
        return;
      }

      setActiveStep((current) => current + 1);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const skip = async () => {
    await finishOnboarding();
    onDone();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle>
        <Typography variant="h6" fontWeight={800}>Configuração inicial</Typography>
        <Typography variant="body2" color="text.secondary">Prepare o sistema para o seu tipo de estoque.</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((step) => <Step key={step}><StepLabel>{step}</StepLabel></Step>)}
        </Stepper>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {activeStep === 0 && (
          <TextField select fullWidth label="Tipo de negócio" value={businessType} onChange={changeBusinessType}>
            {BUSINESS_TYPES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </TextField>
        )}

        {activeStep === 1 && (
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Categorias iniciais"
            value={categories}
            onChange={(event) => setCategories(event.target.value)}
            helperText="Separe as categorias por vírgula. Você pode editar, remover ou adicionar categorias antes de continuar."
          />
        )}

        {activeStep === 2 && (
          <Box sx={{ display: "grid", gap: 2 }}>
            <TextField fullWidth label="Nome do fornecedor" value={supplier.name} onChange={(event) => setSupplier((current) => ({ ...current, name: event.target.value }))} />
            <TextField fullWidth label="E-mail" value={supplier.email} onChange={(event) => setSupplier((current) => ({ ...current, email: event.target.value }))} />
            <TextField fullWidth label="Telefone" value={supplier.phone} onChange={(event) => setSupplier((current) => ({ ...current, phone: event.target.value }))} />
          </Box>
        )}

        {activeStep === 3 && (
          <Alert severity="info">Na próxima etapa você será levado para Produtos. Clique em "Novo produto" para cadastrar o primeiro item.</Alert>
        )}

        {activeStep === 4 && (
          <Alert severity="success">Configuração inicial pronta. Você pode ajustar tudo depois na página Configurações.</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={skip} disabled={loading}>Pular</Button>
        <Button variant="contained" onClick={next} disabled={loading}>{activeStep === 4 ? "Finalizar" : "Continuar"}</Button>
      </DialogActions>
    </Dialog>
  );
}
