/**
 * VÉSPER - Gerador de Gráficos em SVG Puro
 * Gráficos leves, responsivos e elegantes com estética premium dark & bronze/dourado.
 * Sem dependências externas para confiabilidade total offline.
 */

const VesperCharts = {
  // Gráfico de Teia / Radar das 8 Áreas de Desenvolvimento
  renderRadarChart(containerId, areaScores) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 320;
    const center = size / 2;
    const radius = size * 0.38;
    const areas = Object.keys(AREAS_DEFINITION);
    const numPoints = areas.length;
    const angleStep = (Math.PI * 2) / numPoints;

    // Círculos concêntricos de fundo (25%, 50%, 75%, 100%)
    let gridSvg = '';
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach(lvl => {
      let polyPoints = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * (radius * lvl);
        const y = center + Math.sin(angle) * (radius * lvl);
        polyPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      gridSvg += `<polygon points="${polyPoints.join(' ')}" fill="none" stroke="#27272a" stroke-width="1" stroke-dasharray="${lvl < 1 ? '3 3' : 'none'}"/>`;
    });

    // Linhas radiais do centro para cada vértice
    let axisSvg = '';
    let labelsSvg = '';
    let dataPoints = [];

    areas.forEach((areaKey, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const xMax = center + Math.cos(angle) * radius;
      const yMax = center + Math.sin(angle) * radius;
      axisSvg += `<line x1="${center}" y1="${center}" x2="${xMax.toFixed(1)}" y2="${yMax.toFixed(1)}" stroke="#27272a" stroke-width="1"/>`;

      // Ponto de dados real (de 0 a 100)
      const score = Math.min(100, Math.max(15, areaScores[areaKey] || 40));
      const valRadius = (score / 100) * radius;
      const xVal = center + Math.cos(angle) * valRadius;
      const yVal = center + Math.sin(angle) * valRadius;
      dataPoints.push(`${xVal.toFixed(1)},${yVal.toFixed(1)}`);

      // Rótulo da área
      const labelRadius = radius + 22;
      const xLbl = center + Math.cos(angle) * labelRadius;
      const yLbl = center + Math.sin(angle) * labelRadius;
      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.3) textAnchor = 'start';
      if (Math.cos(angle) < -0.3) textAnchor = 'end';

      labelsSvg += `
        <text x="${xLbl.toFixed(1)}" y="${(yLbl + 4).toFixed(1)}" 
          fill="#a1a1aa" font-size="10" font-family="system-ui, sans-serif" 
          font-weight="500" text-anchor="${textAnchor}" class="radar-label">
          ${AREAS_DEFINITION[areaKey].name}
        </text>
      `;
    });

    // Polígono preenchido com gradiente dourado
    const polygonSvg = `
      <defs>
        <radialGradient id="radarGoldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d4af37" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#b38728" stop-opacity="0.1"/>
        </radialGradient>
      </defs>
      <polygon points="${dataPoints.join(' ')}" fill="url(#radarGoldGrad)" stroke="#d4af37" stroke-width="2"/>
    `;

    // Bolinhas em cada ponto
    let dotsSvg = '';
    dataPoints.forEach(pt => {
      const [px, py] = pt.split(',');
      dotsSvg += `<circle cx="${px}" cy="${py}" r="3.5" fill="#f4f4f5" stroke="#d4af37" stroke-width="2"/>`;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" class="vesper-radar-svg" style="width: 100%; max-width: ${size}px; height: auto; display: block; margin: 0 auto;">
        ${gridSvg}
        ${axisSvg}
        ${polygonSvg}
        ${dotsSvg}
        ${labelsSvg}
      </svg>
    `;
  },

  // Gráfico de Linha de Frequência de Registros e Atividades
  renderEvolutionLineChart(containerId, monthsData) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 500;
    const height = 180;
    const padding = { top: 20, right: 30, bottom: 35, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...monthsData.map(d => d.value), 10);
    const stepX = chartW / (monthsData.length - 1 || 1);

    // Grade horizontal
    let gridLines = '';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      gridLines += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#27272a" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="${padding.left - 8}" y="${y + 4}" fill="#71717a" font-size="10" text-anchor="end" font-family="system-ui">${val}</text>
      `;
    }

    // Pontos e Linhas
    let points = [];
    let labelsX = '';
    monthsData.forEach((d, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + chartH - (d.value / maxVal) * chartH;
      points.push({ x, y, val: d.value, label: d.label });
      labelsX += `
        <text x="${x}" y="${height - 12}" fill="#a1a1aa" font-size="11" text-anchor="middle" font-family="system-ui">${d.label}</text>
      `;
    });

    // Caminho da linha
    const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    // Caminho da área de sombra
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

    let dots = '';
    points.forEach(p => {
      dots += `
        <g class="chart-point-group">
          <circle cx="${p.x}" cy="${p.y}" r="4" fill="#d4af37" stroke="#18181b" stroke-width="2"/>
          <text x="${p.x}" y="${p.y - 8}" fill="#f4f4f5" font-size="10" text-anchor="middle" font-weight="600" font-family="system-ui">${p.val}</text>
        </g>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
        <defs>
          <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d4af37" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${areaD}" fill="url(#lineAreaGrad)"/>
        <path d="${pathD}" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}
        ${labelsX}
      </svg>
    `;
  },

  // Gráfico de Barras de Distribuição das Metas por Área
  renderBarChart(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 500;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 40, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(...items.map(d => d.value), 4);
    const barWidth = Math.min(32, (chartW / items.length) * 0.65);
    const stepX = chartW / items.length;

    let barsSvg = '';
    let labelsX = '';

    items.forEach((item, i) => {
      const x = padding.left + i * stepX + (stepX - barWidth) / 2;
      const barH = (item.value / maxVal) * chartH;
      const y = padding.top + chartH - barH;

      barsSvg += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" fill="${item.color || '#d4af37'}" opacity="0.85">
          <title>${item.name}: ${item.value}</title>
        </rect>
        <text x="${x + barWidth / 2}" y="${y - 6}" fill="#f4f4f5" font-size="10" text-anchor="middle" font-family="system-ui" font-weight="600">
          ${item.value}
        </text>
      `;

      labelsX += `
        <text x="${x + barWidth / 2}" y="${height - 18}" fill="#a1a1aa" font-size="10" text-anchor="middle" font-family="system-ui">
          ${item.name.slice(0, 4)}..
        </text>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block;">
        <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#3f3f46" stroke-width="1"/>
        ${barsSvg}
        ${labelsX}
      </svg>
    `;
  },

  // Donut de Status das Metas
  renderStatusDonut(containerId, stats) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = (stats.concluido || 0) + (stats.em_andamento || 0) + (stats.pausado || 0) + (stats.nao_iniciado || 0);
    if (total === 0) {
      container.innerHTML = '<div class="chart-empty-msg">Nenhum dado registrado para exibição.</div>';
      return;
    }

    const size = 160;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circ = 2 * Math.PI * radius;

    const slices = [
      { key: 'concluido', label: 'Concluídas', count: stats.concluido || 0, color: '#34d399' },
      { key: 'em_andamento', label: 'Em Andamento', count: stats.em_andamento || 0, color: '#d4af37' },
      { key: 'nao_iniciado', label: 'Não Iniciadas', count: stats.nao_iniciado || 0, color: '#71717a' },
      { key: 'pausado', label: 'Pausadas', count: stats.pausado || 0, color: '#fb923c' }
    ];

    let currentOffset = 0;
    let circlesSvg = '';

    slices.forEach(s => {
      if (s.count === 0) return;
      const pct = s.count / total;
      const strokeDash = pct * circ;
      const strokeDashoffset = -currentOffset;
      circlesSvg += `
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none"
          stroke="${s.color}" stroke-width="${strokeWidth}"
          stroke-dasharray="${strokeDash} ${circ - strokeDash}"
          stroke-dashoffset="${strokeDashoffset}"
          stroke-linecap="round"
          transform="rotate(-90 ${center} ${center})"
        />
      `;
      currentOffset += strokeDash;
    });

    const completionRate = Math.round(((stats.concluido || 0) / total) * 100);

    let legendHtml = slices.map(s => `
      <div class="donut-legend-item">
        <span class="donut-legend-dot" style="background-color: ${s.color};"></span>
        <span class="donut-legend-text">${s.label} (${s.count})</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="donut-chart-wrapper">
        <div class="donut-chart-svg-box">
          <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
            <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#27272a" stroke-width="${strokeWidth}"/>
            ${circlesSvg}
            <text x="${center}" y="${center + 5}" text-anchor="middle" fill="#f4f4f5" font-size="22" font-weight="700" font-family="system-ui">
              ${completionRate}%
            </text>
            <text x="${center}" y="${center + 22}" text-anchor="middle" fill="#a1a1aa" font-size="10" font-family="system-ui">
              Taxa de Conclusão
            </text>
          </svg>
        </div>
        <div class="donut-legend-box">
          ${legendHtml}
        </div>
      </div>
    `;
  }
};

window.VesperCharts = VesperCharts;
