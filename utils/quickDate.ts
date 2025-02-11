export const getDateRange = (label: string): { startDate: Date; endDate: Date } => {
  const today = new Date();

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23, 59, 59, 999
  );

  const ranges: Record<string, () => { startDate: Date; endDate: Date }> = {
    'Today': () => ({
      startDate: startOfDay,
      endDate: endOfDay
    }),
    'Yesterday': () => {
      const yesterday = new Date(startOfDay);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);
      return {
        startDate: yesterday,
        endDate: yesterdayEnd
      };
    },
    'Week to Date': () => {
      const weekStart = new Date(startOfDay);
      weekStart.setDate(weekStart.getDate() - 7);
      return {
        startDate: weekStart,
        endDate: endOfDay
      };
    },
    'Month to Date': () => {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        startDate: monthStart,
        endDate: endOfDay
      };
    },
    'Year to Date': () => {
      const yearStart = new Date(today.getFullYear(), 0, 1);
      return {
        startDate: yearStart,
        endDate: endOfDay
      };
    },
    'Last Week': () => {
      const lastWeekStart = new Date(startOfDay);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const lastWeekEnd = new Date(startOfDay);
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
      lastWeekEnd.setHours(23, 59, 59, 999);
      return {
        startDate: lastWeekStart,
        endDate: lastWeekEnd
      };
    },
    'Last Month': () => {
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
      return {
        startDate: lastMonthStart,
        endDate: lastMonthEnd
      };
    }
  };

  return ranges[label]?.() || { startDate: startOfDay, endDate: endOfDay };
};