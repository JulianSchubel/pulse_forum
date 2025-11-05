import { enqueueSnackbar, VariantType } from "notistack";

/**
 * Displays a global toast message
 * @param message The message to display
 * @param variant MUI snackbar variant ("success", "error", "warning", "info", "default")
 */
export function showToast(message: string, variant: VariantType = "default") {
    enqueueSnackbar(message, { variant, autoHideDuration: 4000 });
}

