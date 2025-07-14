import { prometixConfig } from './utils';

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
  return data;
};
