import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
  },
};

export default function () {
  const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

  const res = http.get(BASE_URL);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "content present": (r) => r.body.length > 0,
  });

  sleep(1);
}
