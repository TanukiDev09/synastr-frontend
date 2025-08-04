// src/composables/useAstroChart.ts
import { ref } from 'vue';
import Chart from '@astrodraw/astrochart';
import type { NatalChart } from '../graphql/mutations';

// El offset de los signos es una constante que no necesita ser reactiva.
const signOffsets: Record<string, number> = {
  Aries: 0, Taurus: 30, Gemini: 60, Cancer: 90, Leo: 120, Virgo: 150,
  Libra: 180, Scorpio: 210, Sagittarius: 240, Capricorn: 270, Aquarius: 300, Pisces: 330,
};

export function useAstroChart(containerId: string) {
  const chartContainer = ref<HTMLElement | null>(null);

  const drawChart = (natalChart: NatalChart) => {
    if (!chartContainer.value) {
      console.error('El contenedor del gráfico no está disponible.');
      return;
    }
    
    // Limpiamos el contenedor antes de dibujar
    chartContainer.value.innerHTML = '';

    // Convertimos posiciones a grados absolutos
    const cusps = natalChart.houses
      .slice(0, 12)
      .map(h => signOffsets[h.sign] + h.degrees);

    const planets: Record<string, number[]> = {};
    natalChart.positions.forEach((p, index) => {
      const absoluteDegree = signOffsets[p.sign] + p.degrees;
      planets[p.name] = [absoluteDegree + index * 0.1]; // Pequeño offset para evitar solapamientos
    });
    
    // Dibuja el gráfico
    const chart = new Chart(chartContainer.value, 400, 400, {
      COLOR_BACKGROUND: '#ffffff',
      POINTS_COLOR: '#333333',
      HOUSES_LINE_COLOR: '#666666',
    });
    chart.radix({ planets, cusps });
  };

  return {
    chartContainer,
    drawChart,
  };
}