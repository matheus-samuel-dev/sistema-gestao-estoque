import { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Chip,
    Card,
    CardContent,
    Button,
    Modal,
    TextField,
    MenuItem
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import { DataGrid } from "@mui/x-data-grid";

import {
    getMovements,
    createMovement
} from "../../services/stockMovementService";

import {
    getProducts
} from "../../services/productService";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import InputAdornment from "@mui/material/InputAdornment";

import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import IconButton from "@mui/material/IconButton";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Tooltip from "@mui/material/Tooltip";

import {
    deleteMovement
} from "../../services/stockMovementService";
import MovementAttachmentsDialog from "../../components/Movements/MovementAttachmentsDialog";

async function loadExcelTools() {
    const [XLSX, fileSaver] = await Promise.all([
        import("xlsx"),
        import("file-saver"),
    ]);
    const saveAs = fileSaver.saveAs || fileSaver.default?.saveAs || fileSaver.default;
    return { XLSX, saveAs };
}

async function loadPdfTools() {
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
    ]);
    return { jsPDF, autoTable };
}

function Movements() {

    const [rows, setRows] = useState([]);

    const [products, setProducts] = useState([]);

    const [open, setOpen] = useState(false);

    const [productId, setProductId] = useState("");

    const [quantity, setQuantity] = useState("");

    const [type, setType] = useState("ENTRY");
    const [origin, setOrigin] = useState("PURCHASE");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [attachmentTarget, setAttachmentTarget] = useState(null);

    const [snackbarOpen, setSnackbarOpen] =
        useState(false);

    const [snackbarMessage, setSnackbarMessage] =
        useState("");

    const [snackbarSeverity, setSnackbarSeverity] =
        useState("success");

    const clearFilters = () => {

        setSearch("");

        setFilterType("");

        setStartDate("");

        setEndDate("");

    };

    useEffect(() => {

        loadMovements();

        loadProducts();

    }, []);

    async function loadProducts() {

        try {

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            console.error(error);

        }

    }

    async function loadMovements() {

        try {

            const data = await getMovements();

            const formatted = data
                .sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                )
                .map((movement) => ({
                    id: movement.id,

                    product:
                        movement.product?.name,

                    type:
                        movement.type,

                    quantity:
                        movement.quantity,

                    createdBy:
                        movement.createdBy,

                    createdAt:
                        new Date(
                            movement.createdAt
                        ).toLocaleString("pt-BR")
                }));

            setRows(formatted);

        } catch (error) {

            console.error(error);

        }

    }

    const handleCreateMovement = async () => {

        if (!productId || !quantity || Number(quantity) <= 0) {
            showMessage("Selecione um produto e informe uma quantidade válida.", "error");
            return;
        }

        try {

            setSaving(true);

            await createMovement({

                productId,

                quantity: Number(quantity),

                type,
                origin,
                notes

            });

            setOpen(false);

            setProductId("");

            setQuantity("");

            setType("ENTRY");
            setOrigin("PURCHASE");
            setNotes("");

            loadMovements();

            showMessage(
                "Movimentação registrada com sucesso!",
                "success"
            );

        } catch (error) {

            console.error(error);

            showMessage(
                error.response?.data?.message || "Erro ao registrar movimentação",
                "error"
            );

        } finally {
            setSaving(false);
        }

    };

    const handleDeleteMovement = async (id) => {

        const confirmed =
            window.confirm(
                "Deseja realmente excluir esta movimentação?"
            );

        if (!confirmed) return;

        try {

            await deleteMovement(id);

            loadMovements();

            showMessage(
                "Movimentação excluída com sucesso!",
                "success"
            );

        } catch (error) {

            console.error(error);

            showMessage(
                "Erro ao excluir movimentação",
                "error"
            );

        }

    };

    const columns = [

        {
            field: "product",
            headerName: "Produto",
            flex: 1
        },

        {
            field: "type",
            headerName: "Tipo",
            flex: 1,

            renderCell: (params) => (

                <Chip
                    label={
                        params.value === "ENTRY"
                            ? "Entrada"
                            : "Saída"
                    }
                    color={
                        params.value === "ENTRY"
                            ? "success"
                            : "error"
                    }
                />

            )
        },

        {
            field: "quantity",
            headerName: "Quantidade",
            flex: 1
        },

        {
            field: "createdBy",
            headerName: "Usuário",
            flex: 1
        },

        {
            field: "createdAt",
            headerName: "Data",
            flex: 1.5
        },

        {
            field: "actions",
            headerName: "Ações",
            width: 140,

            sortable: false,

            renderCell: (params) => (

                <Box>
                    <Tooltip title="Anexos">
                        <IconButton onClick={() => setAttachmentTarget(params.row)}>
                            <AttachFileIcon />
                        </IconButton>
                    </Tooltip>

                <Tooltip title="Excluir">

                    <IconButton
                        color="error"
                        onClick={() =>
                            handleDeleteMovement(
                                params.row.id
                            )
                        }
                    >

                        <DeleteIcon />

                    </IconButton>

                </Tooltip>
                </Box>

            )
        }


    ];

    const totalEntradas =
        rows.filter(
            row => row.type === "ENTRY"
        ).length;

    const totalSaidas =
        rows.filter(
            row => row.type === "EXIT"
        ).length;

    const totalMovimentos =
        rows.length;

    const [search, setSearch] = useState("");

    const [filterType, setFilterType] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const filteredRows = rows.filter((row) => {

        const matchesSearch =
            row.product
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                );

        const matchesType =
            !filterType ||
            row.type === filterType;

        const rowDate =
            new Date(row.createdAt);

        const matchesStart =
            !startDate ||
            rowDate >=
            new Date(startDate);

        const matchesEnd =
            !endDate ||
            rowDate <=
            new Date(endDate);

        return (
            matchesSearch &&
            matchesType &&
            matchesStart &&
            matchesEnd
        );
    });

    {/*const handleEdit = (row) => {

        console.log("Editar:", row);

        alert(
            "Função de edição será implementada."
        );

    };

    const handleDelete = (id) => {

        const confirmDelete =
            window.confirm(
                "Deseja excluir esta movimentação?"
            );

        if (!confirmDelete) return;

        console.log("Excluir:", id);

    };*/}

    const exportToExcel = async () => {
        const { XLSX, saveAs } = await loadExcelTools();

        const dados = filteredRows.map(row => ({
            Produto: row.product,
            Tipo:
                row.type === "ENTRY"
                    ? "Entrada"
                    : "Saída",
            Quantidade: row.quantity,
            Usuário: row.createdBy,
            Data: row.createdAt
        }));

        console.log(dados);

        const worksheet =
            XLSX.utils.json_to_sheet(dados);

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Movimentações"
        );

        const excelBuffer =
            XLSX.write(
                workbook,
                {
                    bookType: "xlsx",
                    type: "array"
                }
            );

        const fileData =
            new Blob(
                [excelBuffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

        saveAs(
            fileData,
            "movimentacoes.xlsx"
        );

    };

    const exportToPDF = async () => {
        const { jsPDF, autoTable } = await loadPdfTools();

        const doc = new jsPDF();

        doc.setFontSize(18);

        doc.text(
            "Relatório de Movimentações",
            14,
            20
        );

        autoTable(doc, {
            startY: 30,

            head: [[
                "Produto",
                "Tipo",
                "Quantidade",
                "Usuário",
                "Data"
            ]],

            body: filteredRows.map(
                row => [
                    row.product,
                    row.type === "ENTRY"
                        ? "Entrada"
                        : "Saída",
                    row.quantity,
                    row.createdBy,
                    row.createdAt
                ]
            )
        });

        doc.save(
            "movimentacoes.pdf"
        );

    };

    const showMessage = (
        message,
        severity = "success"
    ) => {

        setSnackbarMessage(message);

        setSnackbarSeverity(severity);

        setSnackbarOpen(true);

    };

    return (

        <Box sx={{ minWidth: 0 }}>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                    mb: 4
                }}
            >

                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: 28, sm: 38, md: 48 } }}
                >
                    Movimentações
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        flexWrap: "wrap",
                        "& .MuiButton-root": { flex: { xs: "1 1 130px", sm: "0 0 auto" } }
                    }}
                >

                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<FileDownloadIcon />}
                        onClick={exportToExcel}
                    >
                        Excel
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={exportToPDF}
                    >
                        PDF
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpen(true)}
                    >
                        Nova Movimentação
                    </Button>

                </Box>

            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                    mb: 4
                }}
            >

                <Card
                    sx={{
                        flex: 1,
                        borderRadius: 4,
                        background:
                            "linear-gradient(135deg,#e8f5e9,#ffffff)",
                        border: "1px solid #c8e6c9",
                        boxShadow: 2,

                        transition: "all 0.2s ease",

                        "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: 6
                        }
                    }}
                >
                    <CardContent>

                        <Avatar
                            sx={{
                                bgcolor: "#2e7d32",
                                width: 60,
                                height: 60,
                                mb: 2
                            }}
                        >
                            <TrendingUpIcon />
                        </Avatar>

                        <Typography
                            color="text.secondary"
                            gutterBottom
                        >
                            Entradas
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                        >
                            {totalEntradas}
                        </Typography>

                    </CardContent>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                        borderRadius: 4,
                        background:
                            "linear-gradient(135deg,#ffebee,#ffffff)",
                        border: "1px solid #ffcdd2",
                        boxShadow: 2,

                        transition: "all 0.2s ease",

                        "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: 6
                        }
                    }}
                >
                    <CardContent>

                        <Avatar
                            sx={{
                                bgcolor: "#c62828",
                                width: 60,
                                height: 60,
                                mb: 2
                            }}
                        >
                            <TrendingDownIcon />
                        </Avatar>

                        <Typography
                            color="text.secondary"
                            gutterBottom
                        >
                            Saídas
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                        >
                            {totalSaidas}
                        </Typography>

                    </CardContent>
                </Card>

                <Card
                    sx={{
                        flex: 1,
                        borderRadius: 4,
                        background:
                            "linear-gradient(135deg,#e3f2fd,#ffffff)",
                        border: "1px solid #bbdefb",
                        boxShadow: 2,

                        transition: "all 0.2s ease",

                        "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: 6
                        }
                    }}
                >
                    <CardContent>

                        <Avatar
                            sx={{
                                bgcolor: "#1565c0",
                                width: 60,
                                height: 60,
                                mb: 2
                            }}
                        >
                            <Inventory2Icon />
                        </Avatar>

                        <Typography
                            color="text.secondary"
                            gutterBottom
                        >
                            Total
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            sx={{
                                mt: 1
                            }}
                        >
                            {totalMovimentos}
                        </Typography>

                    </CardContent>
                </Card>


            </Box>

            <Box
                sx={{
                    backgroundColor: "#fff",
                    p: { xs: 2, sm: 3 },
                    borderRadius: 4,
                    mb: 4,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={3}
                    display="flex"
                    alignItems="center"
                    gap={1}
                >
                    <FilterAltIcon />
                    Filtros
                </Typography>

                <TextField
                    fullWidth
                    label="Pesquisar produto"
                    placeholder="Digite o nome do produto..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        flexWrap: "wrap",
                        alignItems: "end"
                    }}
                >

                    <TextField
                        select
                        label="Tipo"
                        value={filterType}
                        onChange={(e) =>
                            setFilterType(
                                e.target.value
                            )
                        }
                        sx={{
                            minWidth: { xs: 0, sm: 220 },
                            width: { xs: "100%", sm: "auto" }
                        }}
                    >
                        <MenuItem value="">
                            Todos
                        </MenuItem>

                        <MenuItem value="ENTRY">
                            Entrada
                        </MenuItem>

                        <MenuItem value="EXIT">
                            Saída
                        </MenuItem>
                    </TextField>

                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                fontWeight: 500
                            }}
                        >
                            Data Inicial
                        </Typography>

                        <TextField
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(
                                    e.target.value
                                )
                            }
                            sx={{
                                minWidth: { xs: 0, sm: 200 },
                                width: { xs: "100%", sm: "auto" }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonthIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                fontWeight: 500
                            }}
                        >
                            Data Final
                        </Typography>

                        <TextField
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(
                                    e.target.value
                                )
                            }
                            sx={{
                                minWidth: { xs: 0, sm: 200 },
                                width: { xs: "100%", sm: "auto" }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonthIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<ClearIcon />}
                        onClick={clearFilters}
                        sx={{
                            height: 56,
                            borderRadius: 2,
                            width: { xs: "100%", sm: "auto" }
                        }}
                    >
                        Limpar
                    </Button>

                </Box>

            </Box>

            <Paper
                elevation={0}
                sx={{
                    mt: 2,
                    height: { xs: 520, md: 600 },
                    width: "100%",
                    borderRadius: 4,
                    overflowX: "auto",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
                }}
            >

                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pageSizeOptions={[
                        5,
                        10,
                        20
                    ]}
                    sx={{
                        border: "none",
                        minWidth: 720,

                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f8fafc",
                            fontWeight: "bold"
                        },

                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#f5f7fb"
                        }
                    }}
                />

            </Paper>

            <Modal
                open={open}
                onClose={() =>
                    setOpen(false)
                }
            >

                <Paper
                    sx={{
                        width: { xs: "calc(100% - 24px)", sm: 500 },
                        maxHeight: "calc(100dvh - 32px)",
                        overflowY: "auto",
                        p: { xs: 2.5, sm: 4 },
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform:
                            "translate(-50%, -50%)",
                        borderRadius: 3
                    }}
                >

                    <Typography
                        variant="h5"
                        mb={3}
                    >
                        Nova Movimentação
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label="Produto"
                        sx={{ mb: 2 }}
                        value={productId}
                        onChange={(e) =>
                            setProductId(
                                e.target.value
                            )
                        }
                    >

                        {products.map(product => (

                            <MenuItem
                                key={product.id}
                                value={product.id}
                            >
                                {product.name}
                            </MenuItem>

                        ))}

                    </TextField>

                    <TextField
                        fullWidth
                        label="Quantidade"
                        type="number"
                        sx={{ mb: 2 }}
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(
                                e.target.value
                            )
                        }
                    />

                    <TextField
                        select
                        fullWidth
                        label="Tipo"
                        sx={{ mb: 3 }}
                        value={type}
                        onChange={(e) =>
                            setType(
                                e.target.value
                            )
                        }
                    >

                        <MenuItem value="ENTRY">
                            Entrada
                        </MenuItem>

                        <MenuItem value="EXIT">
                            Saída
                        </MenuItem>

                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Origem"
                        sx={{ mb: 2 }}
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    >
                        <MenuItem value="PURCHASE">Compra</MenuItem>
                        <MenuItem value="DONATION">Doação</MenuItem>
                        <MenuItem value="TRANSFER">Transferência</MenuItem>
                        <MenuItem value="INTERNAL_PRODUCTION">Produção interna</MenuItem>
                        <MenuItem value="STOCK_ADJUSTMENT">Ajuste de estoque</MenuItem>
                        <MenuItem value="OTHER">Outro</MenuItem>
                    </TextField>

                    <TextField fullWidth multiline minRows={2} label="Observações" value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mb: 2 }} />

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={
                            handleCreateMovement
                        }
                        disabled={saving || !productId || !quantity || Number(quantity) <= 0}
                    >
                        {saving ? "Salvando..." : "Salvar"}
                    </Button>

                </Paper>

            </Modal>

            <MovementAttachmentsDialog
                movement={attachmentTarget}
                open={Boolean(attachmentTarget)}
                onClose={() => setAttachmentTarget(null)}
                notify={showMessage}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbarOpen(false)
                }
            >

                <Alert
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>

            </Snackbar>

        </Box>

    );

}

export default Movements;
