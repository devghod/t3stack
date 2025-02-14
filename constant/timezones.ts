export const timezones = [
  'UTC',
  'America/New_York',      // EST/EDT
  'America/Chicago',       // CST/CDT
  'America/Denver',        // MST/MDT
  'America/Los_Angeles',   // PST/PDT
  'America/Anchorage',     // AKST/AKDT
  'Pacific/Honolulu',      // HST
  'Europe/London',         // BST
  'Europe/Paris',          // CET/CEST
  'Europe/Berlin',         // CET/CEST
  'Europe/Moscow',         // MSK
  'Asia/Dubai',           // GST
  'Asia/Shanghai',        // CST
  'Asia/Tokyo',           // JST
  'Asia/Singapore',       // SGT
  'Australia/Sydney',     // AEST/AEDT
  'Pacific/Auckland',     // NZST/NZDT
].map(tz => ({
  label: tz.replace('_', ' '),
  value: tz
}));
