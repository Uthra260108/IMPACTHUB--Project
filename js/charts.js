/**
 * IMPACTHUB - LIGHTWEIGHT CHARTS & VISUAL ANALYTICS
 * Implemented using pure SVG and CSS variables.
 */

const Charts = (() => {
  // Render Horizontal Bar Chart in a container
  const renderHorizontalBars = (containerId, dataItems) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!dataItems || dataItems.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No analytics data available yet.</p></div>';
      return;
    }

    const maxValue = Math.max(...dataItems.map(d => d.value), 1);

    let html = '<div class="bar-chart-visual">';
    dataItems.forEach(item => {
      const percentage = Math.round((item.value / maxValue) * 100);
      const colorClass = item.variant || 'default';
      html += `
        <div class="bar-item">
          <div class="bar-meta">
            <span>${Utils.escapeHtml(item.label)}</span>
            <span>${item.value} (${item.subtext || percentage + '%'})</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill ${colorClass}" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  };

  // Render SVG Donut Chart for Status Distribution
  const renderDonutChart = (containerId, dataSegments) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const total = dataSegments.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) {
      container.innerHTML = '<p class="text-muted text-center">No session activity recorded.</p>';
      return;
    }

    const size = 180;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    let svgCircles = '';
    dataSegments.forEach(seg => {
      if (seg.value === 0) return;
      const strokeDash = (seg.value / total) * circumference;
      const strokeDashoffset = -accumulatedOffset;
      svgCircles += `
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
          fill="none" 
          stroke="${seg.color}" 
          stroke-width="${strokeWidth}" 
          stroke-dasharray="${strokeDash} ${circumference - strokeDash}" 
          stroke-dashoffset="${strokeDashoffset}"
          style="transition: stroke-dasharray 0.8s ease;"
        />
      `;
      accumulatedOffset += strokeDash;
    });

    let legendHtml = '<div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">';
    dataSegments.forEach(seg => {
      const pct = Math.round((seg.value / total) * 100);
      legendHtml += `
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.84rem;">
          <span style="display:flex; align-items:center; gap:8px;">
            <span style="width:10px; height:10px; border-radius:50%; background:${seg.color};"></span>
            ${Utils.escapeHtml(seg.label)}
          </span>
          <span style="font-weight:600; color:var(--color-wenge);">${seg.value} (${pct}%)</span>
        </div>
      `;
    });
    legendHtml += '</div>';

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
          <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="#EFE9EA" stroke-width="${strokeWidth}" />
          ${svgCircles}
        </svg>
        <div style="width:100%;">${legendHtml}</div>
      </div>
    `;
  };

  return {
    renderHorizontalBars,
    renderDonutChart
  };
})();
