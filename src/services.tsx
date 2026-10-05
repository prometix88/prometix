import { prometixConfig } from './utils';
import { PROMETIX_VERSION } from './version';

const NPM_LATEST_URL = 'https://registry.npmjs.org/prometix/latest';
const REQUEST_TIMEOUT_MS = 3000;

export interface VersionStatus {
  outdated: boolean;
  current: string | null;
  latest: string | null;
}

// The version check is advisory: a slow or unreachable registry must never
// stop the widget from working, so it times out quickly and fails open.
const fetchWithTimeout = async (url: string) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
};

// Compares major.minor.patch only; prerelease tags are ignored.
export const compareVersions = (a: string, b: string): number => {
  const parse = (v: string) =>
    v
      .replace(/^v/, '')
      .split('-')[0]
      .split('.')
      .map((n) => parseInt(n, 10) || 0);
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

let versionCheck: Promise<VersionStatus> | undefined;

// Resolved once per page load; the npm registry is not hit on every modal open.
export const checkLibraryVersion = (): Promise<VersionStatus> => {
  if (!versionCheck) {
    versionCheck = (async () => {
      const current = PROMETIX_VERSION;
      if (!current) return { outdated: false, current, latest: null };
      try {
        const data = await fetchWithTimeout(NPM_LATEST_URL);
        const latest: string | undefined = data?.version;
        if (!latest) return { outdated: false, current, latest: null };
        return { outdated: compareVersions(current, latest) < 0, current, latest };
      } catch {
        return { outdated: false, current, latest: null };
      }
    })();
  }
  return versionCheck;
};

export const getContentSurvey = async (surveyId: string) => {
  const config = prometixConfig().get();
  const response = await fetch(config?.api?.surveyContent?.url, {
    method: config?.api?.surveyContent?.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: surveyId,
    }),
  });
  const data = await response.json();
  if (data?.status === false) {
    throw new Error(data?.message || 'Survey not found');
  }
  return data;
};
