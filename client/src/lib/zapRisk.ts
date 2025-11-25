export const getZapRiskColor = (riskCode: string) => {
  switch (riskCode) {
    case '3':
      return 'bg-red-500 text-white'; // High
    case '2':
      return 'bg-orange-500 text-white'; // Medium
    case '1':
      return 'bg-yellow-500 text-black'; // Low
    case '0':
      return 'bg-blue-500 text-white'; // Informational
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getZapRiskLabel = (riskCode: string) => {
  switch (riskCode) {
    case '3':
      return 'High';
    case '2':
      return 'Medium';
    case '1':
      return 'Low';
    case '0':
      return 'Info';
    default:
      return 'Unknown';
  }
};
