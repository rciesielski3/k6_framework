// Safe against a shared public demo: 2 VUs, 2 iterations each (~24 requests,
// well under 30s).
export const smoke = {
  executor: 'per-vu-iterations',
  vus: 2,
  iterations: 2,
  maxDuration: '30s',
};

// !!! Everything below is for YOUR OWN environment only. Never point these
// !!! at the QuickPizza demo or any host you do not own or have permission for.

export const stages30m10vu = {
  executor: 'ramping-vus',
  startVUs: 2,
  stages: [
    { duration: '10m', target: 2 },
    { duration: '1m', target: 5 },
    { duration: '10m', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '10m', target: 10 },
    { duration: '1m', target: 0 },
  ],
};

export const iterations100 = {
  executor: 'per-vu-iterations',
  vus: 1,
  iterations: 100,
};

export const load30m10vu = {
  executor: 'constant-vus',
  vus: 10,
  duration: '30m',
};

export const singleRun = {
  executor: 'per-vu-iterations',
  vus: 1,
  iterations: 1,
};
