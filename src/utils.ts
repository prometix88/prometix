export interface NpsConfig {
  title: string;
  thankyou: string;
  textButton: string;
  descriptionScore: string;
  illustration: string;
  // API
  endpoint: string;
  endpointMethod: string;
  apiBody: Record<string, string>;
  customerId: string;
  surveyId: string;
  hideFeedbackButton: boolean;
}

export const npsConfig = () => {
  const rawConfig = (window as any).NPSConfig || {};
  const config = {
    title:
      rawConfig?.title ?? 'Seberapa besar kemungkinan Anda merekomendasikan situs ini ke teman?',
    thankyou: rawConfig?.thankyou ?? '🙏 Terima kasih atas feedback Anda!',
    textButton: rawConfig?.textButton ?? '📝 Rate your experience',
    descriptionScore: rawConfig?.descriptionScore,
    illustration:
      rawConfig?.illustration ??
      'https://www.pngall.com/wp-content/uploads/12/Illustration-PNG-Free-Image.png',
    // API
    endpoint: rawConfig?.api ?? 'https://nps-api.telkom-digital.id/v1/feedback',
    endpointMethod: rawConfig?.apiMethod ?? 'POST',
    // OTHERS
    customerId: rawConfig?.customerId ?? '',
    surveyId: rawConfig?.surveyId ?? '',
    hideFeedbackButton: rawConfig?.hideFeedbackButton ?? false,
  };

  return {
    get: () => config,
    set: (newConfig: Partial<NpsConfig>) => {
      (window as any).NPSConfig = { ...config, ...newConfig };
    },
  };
};
