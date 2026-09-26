import multer from "multer";
import path from "path";
import fs from "fs";

const carpetaLogos = path.resolve(
  process.cwd(),
  "uploads",
  "logos"
);

if (!fs.existsSync(carpetaLogos)) {
  fs.mkdirSync(carpetaLogos, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, carpetaLogos);
  },

  filename: (req, file, callback) => {
    const idEmpresa = req.params.id;

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const nombreArchivo =
      `empresa-${idEmpresa}-${Date.now()}${extension}`;

    callback(null, nombreArchivo);
  },
});

export const tiposPermitidos = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const uploadLogoEmpresa = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!tiposPermitidos.includes(file.mimetype)) {
      callback(
        new Error(
          "El logo debe ser una imagen JPG, PNG, WEBP o SVG."
        )
      );

      return;
    }

    callback(null, true);
  },
});