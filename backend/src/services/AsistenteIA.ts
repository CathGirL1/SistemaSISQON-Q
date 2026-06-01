export class AsistenteIA {

    private static instancia: AsistenteIA;

    private constructor() {}

    public static obtenerInstancia(): AsistenteIA {

        if (!AsistenteIA.instancia) {
            AsistenteIA.instancia = new AsistenteIA();
        }

        return AsistenteIA.instancia;
    }

}