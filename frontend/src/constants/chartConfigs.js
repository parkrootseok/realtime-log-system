// 시계열 차트 옵션
export const timeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: '로그 수',
      },
    },
    x: {
      title: {
        display: false,
      },
    },
  },
};

// 파이 차트 옵션
export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
  },
};

// 차트 색상 설정
export const chartColors = {
  info: {
    border: '#3b82f6',
    background: 'rgba(59, 130, 246, 0.5)',
  },
  warn: {
    border: '#f59e0b',
    background: 'rgba(245, 158, 11, 0.5)',
  },
  error: {
    border: '#ef4444',
    background: 'rgba(239, 68, 68, 0.5)',
  },
  total: {
    border: '#6366f1',
    background: 'rgba(99, 102, 241, 0.5)',
  },
};

// 시계열 차트 데이터셋 설정
export const createTimeChartDataset = (label, data, colorType) => ({
  label,
  data,
  borderColor: chartColors[colorType].border,
  backgroundColor: chartColors[colorType].background,
  fill: false,
});

// 파이 차트 데이터셋 설정
export const createPieChartDataset = (data) => ({
  data,
  backgroundColor: [chartColors.info.border, chartColors.warn.border, chartColors.error.border],
  borderColor: [
    chartColors.info.background,
    chartColors.warn.background,
    chartColors.error.background,
  ],
  borderWidth: 1,
});
