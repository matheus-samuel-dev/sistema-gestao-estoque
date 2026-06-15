import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
} from "@mui/material";

import { login } from "../../services/authService";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {

        try {

            const response = await login(
                email,
                password
            );

            localStorage.setItem(
                "token",
                response.token
            );

            navigate("/products");

        } catch (error) {

            console.error(error);

            alert("Login inválido");

        }
    };

    return (
        <Container maxWidth="sm">

            <Paper sx={{ p: 4, mt: 10 }}>

                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Login
                </Typography>

                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Entrar
                </Button>

            </Paper>

        </Container>
    );
}

export default Login;