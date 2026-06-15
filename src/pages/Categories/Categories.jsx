import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../services/categoryService";

import AddIcon from "@mui/icons-material/Add";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCategories();
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);

        setFormData({
            name: "",
            description: "",
        });

        setOpen(true);
    };

    const handleOpenEdit = (category) => {
        setEditingId(category.id);

        setFormData({
            name: category.name || "",
            description: category.description || "",
        });

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        try {
            if (!formData.name.trim()) {
                alert("Informe o nome da categoria.");
                return;
            }

            if (editingId) {
                await updateCategory(editingId, formData);
            } else {
                await createCategory(formData);
            }

            handleClose();
            await loadCategories();
        } catch (error) {
            console.error("Erro ao salvar categoria:", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Deseja realmente excluir esta categoria?"
        );

        if (!confirmed) return;

        try {
            await deleteCategory(id);
            await loadCategories();
        } catch (error) {

            console.log("STATUS:");
            console.log(error.response?.status);

            console.log("DATA:");
            console.log(error.response?.data);

            console.log("HEADERS:");
            console.log(error.response?.headers);

            console.error(error);

        }
    };

    return (
        <Box p={3}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Categorias
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenCreate}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.2,
                        }}
                    >
                        Nova Categoria
                    </Button>
                </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Pesquisar categoria..."
                    variant="outlined"
                />
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                }}
            >
                <Table>
                    <TableHead
                        sx={{
                            backgroundColor: "#f5f7fb",
                        }}
                    >
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    Nenhuma categoria cadastrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow
                                    key={category.id}
                                    hover
                                >
                                    <TableCell>{category.name}</TableCell>

                                    <TableCell>
                                        {category.description || "-"}
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            sx={{ mr: 1 }}
                                            onClick={() => handleOpenEdit(category)}
                                        >
                                            Editar
                                        </Button>

                                        <Button
                                            color="error"
                                            variant="contained"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Excluir
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {editingId
                        ? "Editar Categoria"
                        : "Nova Categoria"}
                </DialogTitle>

                <DialogContent>
                    <TextField
                        label="Nome"
                        fullWidth
                        margin="normal"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value,
                            })
                        }
                    />

                    <TextField
                        label="Descrição"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSave}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Categories;
