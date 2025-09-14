import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, Modal } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

const ErrorPopup = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const errorMessage = useSelector((state) => state.errors?.[0]?.message || "An unexpected error occurred.");

    const handleSendReport = () => {
        dispatch({ type: "SEND_ERROR_REPORT", payload: { error: errorMessage } });
        alert("Error report sent!");
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2">
                    Error
                </Typography>
                <Typography sx={{ mt: 2 }}>{errorMessage}</Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendReport}
                    >
                        Send Error Report
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={onClose}
                    >
                        Dismiss
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

ErrorPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ErrorPopup;