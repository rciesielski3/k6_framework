// Smoke/availability gate, not a performance claim. With ~20 requests a single
// failure is already 5%, so http_req_failed < 1% effectively means "no errors".
// p95 is generous because the target is shared and runner latency varies;
// with so few samples percentiles are coarse.
export const smoke = {
  http_req_failed: ['rate < 0.01'],
  checks: ['rate > 0.99'],
  http_req_duration: ['p(95) < 800'],
};

// For load scenarios against your own environment.
export const standard = {
  http_req_duration: ['p(90) < 400'],
  http_req_failed: ['rate < 0.01'],
};
