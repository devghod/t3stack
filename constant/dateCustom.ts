export const quickDates = [
  { label: 'Today', value: new Date() },
  { label: 'Yesterday', value: new Date(new Date().setDate(new Date().getDate() - 1)) },
  { label: 'Week to Date', value: (() => {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return firstDayOfWeek;
  })() },
  { label: 'Month to Date', value: (() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  })() },
  { label: 'Year to Date', value: (() => {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1);
  })() },
  { label: 'Last Week', value: (() => {
    const now = new Date();
    const lastWeek = new Date(now.setDate(now.getDate() - 7));
    return new Date(lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay()));
  })() },
  { label: 'Last Month', value: (() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
  })() },
] as const;