import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Menu } from "../components/Menu";
import { Container } from "../components/Container";
import { useNavigate } from "react-router-dom";
import { URLS } from "../navigation/constants";
import { imageUploadService } from "../services/pagoService";

const PaymentConfirmationPage = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setUploadMessage(null);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage("Por favor, selecciona un archivo primero.");
            return;
        }

        setUploading(true);
        setUploadMessage("Subiendo comprobante...");

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await imageUploadService.uploadImage(formData);
            console.log("Comprobante subido con éxito:", response);
            setUploadMessage("¡Comprobante subido con éxito!");

            navigate(URLS.PAGO_COMPLETADO, { state: { success: true, purchaseData: response.compra } });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error al subir el comprobante:", error);
            const errorMessage = error.message || "Error desconocido al subir el comprobante.";
            setUploadMessage(`Error: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Menu />
            <Container>
                <Card title="Confirmación de Pago">
                    <div className="flex flex-col items-center justify-center p-4">
                        <p className="text-lg mb-4 text-center">
                            Por favor, envía una imagen de tu comprobante de pago para finalizar la compra.
                        </p>

                        <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden shadow-md">
                            {selectedFile ? (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Vista previa del comprobante"
                                    className="max-w-xs h-auto object-contain"
                                    style={{ maxHeight: '300px' }}
                                />
                            ) : (
                                <img
                                    src="https://previews.123rf.com/images/wongstock/wongstock1312/wongstock131200007/24570090-p%C3%ADxel-car%C3%A1cter-dice-hola-en-falso-resumen-c%C3%B3digo-qr.jpg"
                                    alt="Código QR de Pago"
                                    className="max-w-xs h-auto object-contain"
                                />
                            )}
                        </div>

                        <div className="w-full max-w-md mb-4">
                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                                Selecciona tu imagen de comprobante:
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-full file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-blue-50 file:text-blue-700
                                           hover:file:bg-blue-100"
                            />
                        </div>

                        {uploadMessage && (
                            <p className={`mb-4 text-sm ${uploadMessage.includes("éxito") ? "text-green-600" : "text-red-600"}`}>
                                {uploadMessage}
                            </p>
                        )}

                        <Button
                            onClick={handleUpload}
                            variant="primary"
                            title={uploading ? "Subiendo..." : "Enviar Comprobante"}
                            />
                            <br></br>
                        <Button
                            onClick={() => navigate(URLS.HOME)}
                            title="Volver a la tienda"
                            />
                    </div>
                </Card>
            </Container>
        </>
    );
};

export default PaymentConfirmationPage;