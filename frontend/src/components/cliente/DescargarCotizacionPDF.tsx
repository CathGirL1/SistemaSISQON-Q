import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "../../styles/DescargarCotizacionPDF.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// =====================================================
// MATERIAL
// =====================================================

interface MaterialCotizacion {
  idMaterialProyecto: number;
  idProyecto: number;
  idMaterial: number;
  cantidad: number;
  nombre: string;
  costoUnitario: number;
  unidad: string | null;
  subtotal: number;
}

// =====================================================
// COTIZACIÓN
// =====================================================

interface CotizacionPDF {
  idCotizacion: number;
  idProyecto: number;
  codigo: string;
  version: number;

  fechaCreacion: string;
  fechaActualizacion: string | null;

  estado: string;

  precioEstimado: number | null;
  precioEstimadoUYU: number | null;

  tipoCambio: number;
  moneda: string;

  observaciones: string | null;

  idCliente: number;
  idTipoObra: number;

  nombreProyecto: string;
  descripcionProyecto: string | null;
  ubicacion: string | null;

  alto: number;
  ancho: number;
  largo: number;
  superficie: number;

  cliente?: string;
  email?: string;
  telefono?: string | null;

  nombreEmpresa?: string;

  // IMPORTANTE:
  // Estos valores se consideran USD
  costoMateriales: number;
  costoManoObra: number;
  totalCotizacion: number;

  materiales?: MaterialCotizacion[];
}

// =====================================================
// PROPS
// =====================================================

interface DescargarCotizacionPDFProps {
  idCotizacion: number;
}

// =====================================================
// COMPONENTE
// =====================================================

export default function DescargarCotizacionPDF({
  idCotizacion,
}: DescargarCotizacionPDFProps) {
  const [generando, setGenerando] = useState(false);

  // ===================================================
  // FORMATEAR USD
  // ===================================================

  const formatearUSD = (
    valor: number | null | undefined
  ): string => {
    if (valor === null || valor === undefined) {
      return "Sin calcular";
    }

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valor);
  };

  // ===================================================
  // FORMATEAR UYU
  // ===================================================

  const formatearUYU = (
    valor: number | null | undefined
  ): string => {
    if (valor === null || valor === undefined) {
      return "Sin calcular";
    }

    return new Intl.NumberFormat("es-UY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  // ===================================================
  // FECHA
  // ===================================================

  const formatearFecha = (fecha: string): string => {
    const fechaCotizacion = new Date(fecha);

    if (Number.isNaN(fechaCotizacion.getTime())) {
      return "Fecha no disponible";
    }

    return new Intl.DateTimeFormat("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fechaCotizacion);
  };

  // ===================================================
  // GENERAR PDF
  // ===================================================

  const generarPDF = async () => {
    try {
      setGenerando(true);

      // -------------------------------------------------
      // OBTENER COTIZACIÓN
      // -------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/cotizaciones/${idCotizacion}`
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo obtener la información de la cotización"
        );
      }

      const cotizacion: CotizacionPDF =
        await response.json();

      // -------------------------------------------------
      // TIPO DE CAMBIO
      // -------------------------------------------------

      const tipoCambio =
        Number(cotizacion.tipoCambio) || 0;

      if (tipoCambio <= 0) {
        throw new Error(
          "La cotización no posee un tipo de cambio válido."
        );
      }

      // -------------------------------------------------
      // CONVERSIÓN USD → UYU
      //
      // 1 USD = tipoCambio UYU
      //
      // UYU = USD * tipoCambio
      // -------------------------------------------------

      const convertirUSDaUYU = (
        valorUSD: number
      ): number => {
        return valorUSD * tipoCambio;
      };

      // -------------------------------------------------
      // COSTOS PRINCIPALES
      // -------------------------------------------------

      const costoMaterialesUSD =
        Number(cotizacion.costoMateriales) || 0;

      const costoManoObraUSD =
        Number(cotizacion.costoManoObra) || 0;

      // El total se obtiene de materiales + mano de obra.
      // De esta forma evitamos mostrar un total desactualizado.
      const totalUSD =
        costoMaterialesUSD + costoManoObraUSD;

      const costoMaterialesUYU =
        convertirUSDaUYU(costoMaterialesUSD);

      const costoManoObraUYU =
        convertirUSDaUYU(costoManoObraUSD);

      const totalUYU =
        convertirUSDaUYU(totalUSD);

      // -------------------------------------------------
      // CREAR PDF
      // -------------------------------------------------

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const margen = 15;

      const anchoPagina =
        doc.internal.pageSize.getWidth();

        const alturaPagina = doc.internal.pageSize.getHeight();

        // Espacio reservado para evitar que el contenido
        // se superponga con el pie de página.
        const limiteContenido = alturaPagina - 35;

      // =================================================
      // ENCABEZADO
      // =================================================

      doc.setFont("times", "bold");
      doc.setFontSize(20);

      doc.text(
        "SISCON-Q",
        margen,
        20
      );

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      doc.text(
        "Sistema de Cotización Inteligente",
        margen,
        26
      );

      doc.setLineWidth(0.5);

      doc.line(
        margen,
        31,
        anchoPagina - margen,
        31
      );

      // =================================================
      // DATOS DE LA COTIZACIÓN
      // =================================================

      doc.setFont("times", "bold");
      doc.setFontSize(16);

      doc.text(
        "COTIZACIÓN",
        margen,
        42
      );

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      doc.text(
        `Código: ${cotizacion.codigo}`,
        margen,
        50
      );

      doc.text(
        `Versión: ${cotizacion.version}`,
        margen,
        56
      );

      doc.text(
        `Fecha: ${formatearFecha(
          cotizacion.fechaCreacion
        )}`,
        margen,
        62
      );

      doc.text(
        `Estado: ${cotizacion.estado}`,
        margen,
        68
      );

      // =====================================================
      // INFORMACIÓN DEL CLIENTE
      // =====================================================

        let y = 80;

        const verificarEspacio = (espacioNecesario: number) => {
            if (y + espacioNecesario > limiteContenido) {
                doc.addPage();
                y = 25;
            }
        };

        doc.setFont("times", "bold");
        doc.setFontSize(13);

        doc.text(
        "Datos del cliente",
        margen,
        y
        );

        y += 8;

        doc.setFont("times", "normal");
        doc.setFontSize(10);

        doc.text(
        `Cliente: ${cotizacion.cliente ?? "No disponible"}`,
        margen,
        y
        );

        y += 6;

        doc.text(
        `Email: ${cotizacion.email ?? "No disponible"}`,
        margen,
        y
        );

        y += 6;

        doc.text(
        `Teléfono: ${cotizacion.telefono ?? "No disponible"}`,
        margen,
        y
        );

      // =================================================
      // DATOS DEL PROYECTO
      // =================================================

      y += 6;

      doc.setFont("times", "bold");
      doc.setFontSize(13);

      doc.text(
        "Datos del proyecto",
        margen,
        y
      );

      y += 8;

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      doc.text(
        `Proyecto: ${cotizacion.nombreProyecto}`,
        margen,
        y
      );

      y += 6;

      if (cotizacion.ubicacion) {
        doc.text(
          `Ubicación: ${cotizacion.ubicacion}`,
          margen,
          y
        );

        y += 6;
      }

      // =================================================
      // DESCRIPCIÓN
      // =================================================

      if (cotizacion.descripcionProyecto) {
        const descripcion =
          doc.splitTextToSize(
            `Descripción: ${cotizacion.descripcionProyecto}`,
            anchoPagina - margen * 2
          );

        doc.text(
          descripcion,
          margen,
          y
        );

        y += descripcion.length * 5;
      }

      // =================================================
      // DIMENSIONES
      // =================================================

      y += 5;

      doc.setFont("times", "bold");
      doc.setFontSize(13);

      doc.text(
        "Dimensiones",
        margen,
        y
      );

      y += 8;

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      doc.text(
        `Ancho: ${cotizacion.ancho} m`,
        margen,
        y
      );

      doc.text(
        `Largo: ${cotizacion.largo} m`,
        margen + 55,
        y
      );

      doc.text(
        `Alto: ${cotizacion.alto} m`,
        margen + 110,
        y
      );

      y += 6;

      doc.text(
        `Superficie: ${Number(
          cotizacion.superficie
        ).toFixed(2)} m²`,
        margen,
        y
      );

    // =====================================================
    // ACLARACIÓN DEL CÁLCULO
    // =====================================================

    y += 12;

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("Criterio de cálculo", margen, y);

    y += 6;

    doc.setFont("times", "normal");
    doc.setFontSize(9);

    const aclaracionCalculo =
    "La cotización toma como referencia las dimensiones ingresadas del proyecto " +
    "(ancho, largo y alto). La superficie se calcula a partir de estas dimensiones " +
    "y se utiliza el metro cuadrado (m²) como unidad de referencia para la estimación.";

    const textoAclaracion = doc.splitTextToSize(
    aclaracionCalculo,
    anchoPagina - margen * 2
    );

    doc.text(textoAclaracion, margen, y);

    y += textoAclaracion.length * 4.5;

      // =================================================
      // MATERIALES
      // =================================================

      y += 12;

      doc.setFont("times", "bold");
      doc.setFontSize(13);

      doc.text(
        "Materiales",
        margen,
        y
      );

      y += 4;

      if (
        cotizacion.materiales &&
        cotizacion.materiales.length > 0
      ) {
        autoTable(doc, {
          startY: y + 4,

          head: [
            [
              "Material",
              "Cantidad",
              "Unidad",
              "Costo unitario",
              "Subtotal",
            ],
          ],

          body: cotizacion.materiales.map(
            (material) => {
              // -----------------------------------------
              // MATERIAL EN USD
              // -----------------------------------------

              const costoUnitarioUSD =
                Number(
                  material.costoUnitario
                ) || 0;

              const subtotalUSD =
                Number(
                  material.subtotal
                ) || 0;

              // -----------------------------------------
              // CONVERSIÓN A UYU
              // -----------------------------------------

              const costoUnitarioUYU =
                convertirUSDaUYU(
                  costoUnitarioUSD
                );

              const subtotalUYU =
                convertirUSDaUYU(
                  subtotalUSD
                );

              return [
                material.nombre,

                material.cantidad.toString(),

                material.unidad ?? "-",

                `$${formatearUSD(
                  costoUnitarioUSD
                )} USD\n($${formatearUYU(
                  costoUnitarioUYU
                )} UYU)`,

                `$${formatearUSD(
                  subtotalUSD
                )} USD\n($${formatearUYU(
                  subtotalUYU
                )} UYU)`,
              ];
            }
          ),

          theme: "grid",

          styles: {
            font: "times",
            fontSize: 8,
            cellPadding: 3,
            textColor: 0,
          },

          headStyles: {
            font: "times",
            fontStyle: "bold",
            fontSize: 8,
          },

          bodyStyles: {
            font: "times",
            fontSize: 8,
          },

          columnStyles: {
            0: {
              cellWidth: 50,
            },

            1: {
              cellWidth: 22,
              halign: "center",
            },

            2: {
              cellWidth: 22,
              halign: "center",
            },

            3: {
              cellWidth: 43,
              halign: "right",
            },

            4: {
              cellWidth: 43,
              halign: "right",
            },
          },

          margin: {
            left: margen,
            right: margen,
          },

          didParseCell: (data) => {
            data.cell.styles.font = "times";
          },
        });

        // -----------------------------------------------
        // POSICIÓN DESPUÉS DE LA TABLA
        // -----------------------------------------------

        const ultimaPosicion =
          (doc as any).lastAutoTable.finalY;

        y = ultimaPosicion + 12;
      } else {
        doc.setFont("times", "normal");
        doc.setFontSize(10);

        doc.text(
          "No se registraron materiales para esta cotización.",
          margen,
          y + 8
        );

        y += 18;
      }

      // =================================================
      // RESUMEN DE COSTOS
      // =================================================

      verificarEspacio(65);

      doc.setFont("times", "bold");
      doc.setFontSize(13);

      doc.text(
        "Resumen de costos",
        margen,
        y
      );

      y += 9;

      // -------------------------------------------------
      // COSTO MATERIALES
      // -------------------------------------------------

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      doc.text(
        "Costo de materiales:",
        margen,
        y
      );

      doc.text(
        `$${formatearUSD(
          costoMaterialesUSD
        )} USD`,
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      y += 5;

      doc.setFontSize(9);

      doc.text(
        `($${formatearUYU(
          costoMaterialesUYU
        )} UYU)`,
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      y += 9;

      // -------------------------------------------------
      // MANO DE OBRA
      // -------------------------------------------------

      doc.setFontSize(10);

      doc.text(
        "Costo de mano de obra:",
        margen,
        y
      );

      doc.text(
        `$${formatearUSD(
          costoManoObraUSD
        )} USD`,
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      y += 5;

      doc.setFontSize(9);

      doc.text(
        `($${formatearUYU(
          costoManoObraUYU
        )} UYU)`,
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      // =================================================
      // TOTAL
      // =================================================

      y += 10;

      doc.setLineWidth(0.4);

      doc.line(
        margen,
        y,
        anchoPagina - margen,
        y
      );

      y += 10;

      doc.setFont("times", "bold");
      doc.setFontSize(15);

      doc.text(
        "TOTAL",
        margen,
        y
      );

      doc.text(
        `$${formatearUSD(
          totalUSD
        )} USD`,
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      y += 7;

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      doc.text(
        `($${formatearUYU(
          totalUYU
        )} UYU)`,
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      y += 9;

      // =================================================
      // TIPO DE CAMBIO
      // =================================================

      doc.setFont("times", "normal");
      doc.setFontSize(9);

      doc.text(
        `Tipo de cambio utilizado: ${tipoCambio.toFixed(
          2
        )} UYU/USD`,
        anchoPagina - margen,
        y,
        {
          align: "right",
        }
      );

      // =================================================
      // PRECIO ESTIMADO
      // =================================================

      if (
        cotizacion.precioEstimado !== null &&
        cotizacion.precioEstimado !== undefined
      ) {
        y += 15;

        verificarEspacio(55);

        const precioEstimadoUSD =
          Number(
            cotizacion.precioEstimado
          ) || 0;

        const precioEstimadoUYU =
          convertirUSDaUYU(
            precioEstimadoUSD
          );

        doc.setFont("times", "bold");
        doc.setFontSize(11);

        doc.text(
          "Precio estimado",
          margen,
          y
        );

        y += 8;

        doc.setFont("times", "normal");
        doc.setFontSize(10);

        // USD
        doc.text(
          "USD:",
          margen,
          y
        );

        doc.text(
          `$${formatearUSD(
            precioEstimadoUSD
          )} USD`,
          anchoPagina - margen,
          y,
          {
            align: "right",
          }
        );

        y += 7;

        // UYU
        doc.text(
          "UYU:",
          margen,
          y
        );

        doc.text(
          `$${formatearUYU(
            precioEstimadoUYU
          )} UYU`,
          anchoPagina - margen,
          y,
          {
            align: "right",
          }
        );

        y += 7;

        doc.setFontSize(9);

        doc.text(
          `Tipo de cambio: ${tipoCambio.toFixed(
            2
          )} UYU/USD`,
          margen,
          y
        );
      }

      // =================================================
      // OBSERVACIONES
      // =================================================

      if (cotizacion.observaciones) {
        y += 15;

        verificarEspacio(55);

        doc.setFont("times", "bold");
        doc.setFontSize(11);

        doc.text(
          "Observaciones",
          margen,
          y
        );

        y += 7;

        doc.setFont("times", "normal");
        doc.setFontSize(9);

        const observaciones =
          doc.splitTextToSize(
            cotizacion.observaciones,
            anchoPagina - margen * 2
          );

        doc.text(
          observaciones,
          margen,
          y
        );
      }

      // =================================================
      // PIE DE PÁGINA
      // =================================================

      const paginas =
        doc.getNumberOfPages();

      for (
        let pagina = 1;
        pagina <= paginas;
        pagina++
      ) {
        doc.setPage(pagina);

        const alturaPagina =
          doc.internal.pageSize.getHeight();

        doc.setFont("times", "normal");
        doc.setFontSize(8);

        doc.setLineWidth(0.3);

        doc.line(
          margen,
          alturaPagina - 18,
          anchoPagina - margen,
          alturaPagina - 18
        );

        doc.text(
          "SISCON-Q - Sistema de Cotización Inteligente",
          margen,
          alturaPagina - 12
        );

        doc.text(
          `Página ${pagina} de ${paginas}`,
          anchoPagina - margen,
          alturaPagina - 12,
          {
            align: "right",
          }
        );
      }

      // =================================================
      // DESCARGAR
      // =================================================

      const nombreArchivo =
        cotizacion.codigo
          ? `Cotizacion-${cotizacion.codigo}.pdf`
          : `Cotizacion-${cotizacion.idCotizacion}.pdf`;

      doc.save(nombreArchivo);
    } catch (error) {
      console.error(
        "Error al generar PDF:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo generar el PDF"
      );
    } finally {
      setGenerando(false);
    }
  };

  // ===================================================
  // BOTÓN
  // ===================================================

  return (
    <button
      type="button"
      className="descargar-cotizacion-pdf"
      onClick={generarPDF}
      disabled={generando}
      title={
        generando
          ? "Generando PDF..."
          : "Descargar cotización en PDF"
      }
    >
      {generando ? (
        <>
          <Loader2
            size={16}
            className="pdf-spinner"
          />

          Generando...
        </>
      ) : (
        <>
          <Download size={16} />

          PDF
        </>
      )}
    </button>
  );
}