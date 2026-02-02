import type { LatLng } from "./geo";
import { haversineKm } from "./geo";

export type TspResult = {
  order: number[]; // indices into input points, starting with 0
  totalKm: number;
};

export function solveTsp(points: LatLng[]): TspResult {
  if (points.length <= 1) return { order: [0], totalKm: 0 };

  const n = points.length;
  const dist = buildDistanceMatrix(points);

  // Exact DP is great for small N (excluding start 0).
  // Complexity: O(n^2 * 2^(n-1)).
  if (n <= 11) {
    return heldKarpPath(dist);
  }

  const initial = nearestNeighborPath(dist);
  const improved = twoOptImprove(initial, dist);
  return { order: improved, totalKm: pathLengthKm(improved, dist) };
}

function buildDistanceMatrix(points: LatLng[]): number[][] {
  const n = points.length;
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const km = haversineKm(points[i]!, points[j]!);
      dist[i]![j] = km;
      dist[j]![i] = km;
    }
  }
  return dist;
}

function heldKarpPath(dist: number[][]): TspResult {
  const n = dist.length;
  const m = n - 1; // nodes 1..n-1 are the visit set

  // dp[mask][j] = best cost to start at 0 and reach node j (j in 1..n-1)
  // visiting exactly the nodes in mask (mask over 1..n-1), and ending at j.
  const size = 1 << m;
  const dp: number[][] = Array.from({ length: size }, () =>
    Array(n).fill(Number.POSITIVE_INFINITY)
  );
  const parent: number[][] = Array.from({ length: size }, () => Array(n).fill(-1));

  for (let j = 1; j < n; j++) {
    const bit = 1 << (j - 1);
    dp[bit]![j] = dist[0]![j];
    parent[bit]![j] = 0;
  }

  for (let mask = 1; mask < size; mask++) {
    for (let j = 1; j < n; j++) {
      const jBit = 1 << (j - 1);
      if ((mask & jBit) === 0) continue;

      const prevMask = mask ^ jBit;
      if (prevMask === 0) continue;

      for (let k = 1; k < n; k++) {
        const kBit = 1 << (k - 1);
        if ((prevMask & kBit) === 0) continue;

        const cand = dp[prevMask]![k] + dist[k]![j];
        if (cand < dp[mask]![j]) {
          dp[mask]![j] = cand;
          parent[mask]![j] = k;
        }
      }
    }
  }

  const full = size - 1;
  let bestEnd = 1;
  let bestCost = Number.POSITIVE_INFINITY;
  for (let j = 1; j < n; j++) {
    if (dp[full]![j] < bestCost) {
      bestCost = dp[full]![j];
      bestEnd = j;
    }
  }

  // Reconstruct path 0 -> ... -> bestEnd (no return-to-start).
  const order: number[] = [bestEnd];
  let mask = full;
  let cur = bestEnd;
  while (cur !== 0) {
    const prev = parent[mask]![cur];
    if (prev === -1) break;
    if (prev === 0) {
      order.push(0);
      break;
    }
    order.push(prev);
    mask = mask ^ (1 << (cur - 1));
    cur = prev;
  }

  order.reverse();

  return { order, totalKm: bestCost };
}

function nearestNeighborPath(dist: number[][]): number[] {
  const n = dist.length;
  const visited = new Array(n).fill(false);
  const order: number[] = [0];
  visited[0] = true;

  for (let step = 1; step < n; step++) {
    const last = order[order.length - 1]!;
    let best = -1;
    let bestD = Number.POSITIVE_INFINITY;
    for (let j = 0; j < n; j++) {
      if (visited[j]) continue;
      const d = dist[last]![j];
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    visited[best] = true;
    order.push(best);
  }

  return order;
}

function twoOptImprove(order: number[], dist: number[][]): number[] {
  const n = order.length;
  if (n < 4) return order;

  let improved = true;
  let bestOrder = order.slice();
  let bestLen = pathLengthKm(bestOrder, dist);

  // Limit iterations to keep UI snappy.
  for (let iter = 0; iter < 20 && improved; iter++) {
    improved = false;

    for (let i = 1; i < n - 2; i++) {
      for (let k = i + 1; k < n - 1; k++) {
        const candidate = twoOptSwap(bestOrder, i, k);
        const candLen = pathLengthKm(candidate, dist);
        if (candLen + 1e-9 < bestLen) {
          bestLen = candLen;
          bestOrder = candidate;
          improved = true;
        }
      }
    }
  }

  return bestOrder;
}

function twoOptSwap(route: number[], i: number, k: number): number[] {
  const start = route.slice(0, i);
  const middle = route.slice(i, k + 1).reverse();
  const end = route.slice(k + 1);
  return start.concat(middle, end);
}

function pathLengthKm(order: number[], dist: number[][]): number {
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += dist[order[i]!]![order[i + 1]!];
  }
  return total;
}
