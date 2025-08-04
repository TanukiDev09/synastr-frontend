declare module '@astrodraw/astrochart' {
  export default class Chart {
    /**
     * Crea una nueva instancia de Chart.
     * @param container ID del contenedor (string) o elemento HTMLElement donde se dibujará el gráfico.
     * @param width Ancho del gráfico.
     * @param height Alto del gráfico.
     * @param settings Configuración opcional del gráfico (colores, escalas, etc.).
     */
    constructor(container: string | HTMLElement, width: number, height: number, settings?: object);

    /**
     * Dibuja una carta natal (radix) con los datos proporcionados.
     * @param data Objeto con planetas y cúspides de casas.
     *  - planets: Un objeto donde cada clave es el nombre del planeta y su valor es un array con la posición en grados.
     *  - cusps: Un array con 12 valores numéricos correspondientes a las cúspides de las casas en grados.
     */
    radix(data: { planets: Record<string, number[]>; cusps: number[] }): void;
  }
}
