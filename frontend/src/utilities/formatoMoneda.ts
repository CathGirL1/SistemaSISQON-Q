/* ================================================= */
/* FORMATEAR PRECIO UYU */
/* ================================================= */

export function formatearPrecioUYU(
  precio: number | null | undefined
): string {
  if (
    precio === null ||
    precio === undefined
  ) {
    return "Sin calcular";
  }

  return new Intl.NumberFormat(
    "es-UY",
    {
      style: "currency",
      currency: "UYU",
      maximumFractionDigits: 0,
    }
  ).format(precio);
}

/* ================================================= */
/* FORMATEAR PRECIO USD */
/* ================================================= */

export function formatearPrecioUSD(
  precio: number | null | undefined
): string {
  if (
    precio === null ||
    precio === undefined
  ) {
    return "Sin calcular";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(precio);
}

/* ================================================= */
/* MOSTRAR AMBAS MONEDAS */
/* ================================================= */

export function formatearPrecioDoble(
  precioUSD: number | null | undefined,
  precioUYU: number | null | undefined
): string {
  if (
    precioUSD === null ||
    precioUSD === undefined
  ) {
    return "Sin calcular";
  }

  if (
    precioUYU === null ||
    precioUYU === undefined
  ) {
    return formatearPrecioUSD(precioUSD);
  }

  return `${formatearPrecioUYU(precioUYU)} UYU (${formatearPrecioUSD(precioUSD)} USD)`;
}