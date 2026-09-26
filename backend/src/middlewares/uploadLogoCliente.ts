import multer from "multer";
import path from "path";
import fs from "fs";

import { tiposPermitidos } from "./uploadLogoEmpresa";

const carpetaLogosClientes = path.resolve(
  process.cwd(),
  "uploads",
  "logos-clientes"
);

if (!fs.existsSync(carpetaLogosClientes)) {
  fs.mkdirSync(carpetaLogosClientes, {
    recursive: true,
  });
}



const storageCliente = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, carpetaLogosClientes);
  },

  filename: (req, file, callback) => {
    const idCliente = req.params.id;

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const nombreArchivo =
      `cliente-${idCliente}-${Date.now()}${extension}`;

    callback(null, nombreArchivo);
  },
});

export const uploadFotoCliente = multer({
  storage: storageCliente,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!tiposPermitidos.includes(file.mimetype)) {
      callback(
        new Error(
          "La foto debe ser una imagen JPG, PNG, WEBP o SVG."
        )
      );
      return;
    }

    callback(null, true);
  },
});