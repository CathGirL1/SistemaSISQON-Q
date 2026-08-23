export class MonedaService {

    public async obtenerDolarAPesoUruguayo(): Promise<number> {

        const response = await fetch(
            "https://open.er-api.com/v6/latest/USD"
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo obtener el tipo de cambio"
            );
        }

        const data = await response.json();

        const valor = Number(data.rates?.UYU);

        if (!Number.isFinite(valor)) {
            throw new Error(
                "El tipo de cambio USD/UYU no es válido"
            );
        }

        return valor;
    }
}