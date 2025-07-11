import { init } from './index';

export interface FeedbackConfig {
  title: string;
  thankyou: string;
  textSubmitted: string;
  textButton: string;
  descriptionScore: string;
  illustration: string;
  // API
  api: {
    submit: {
      method: string;
      url: string;
    };
    check: {
      method: string;
      url: string;
    };
  };
  customerId: string;
  surveyId: string;
  hideFeedbackButton: boolean;
}

export const feedbackConfig = () => {
  const rawConfig = (window as any).FeedbackUs || {};
  const config = {
    title:
      rawConfig?.title ?? 'Seberapa besar kemungkinan Anda merekomendasikan situs ini ke teman?',
    thankyou: rawConfig?.thankyou ?? '🙏 Terima kasih atas feedback Anda!',
    textSubmitted: rawConfig?.textSubmitted ?? 'Anda telah memberikan feedback. Terima kasih 🙏',
    textButton: rawConfig?.textButton ?? '📝 Rate your experience',
    descriptionScore: rawConfig?.descriptionScore,
    illustration:
      rawConfig?.illustration ??
      'https://www.pngall.com/wp-content/uploads/12/Illustration-PNG-Free-Image.png',
    // API
    api: {
      submit: {
        url: rawConfig?.api?.submit?.url || 'https://nps-api.telkom-digital.id/v1/feedback',
        method: rawConfig?.api?.submit?.method || 'POST',
      },
      check: {
        url:
          rawConfig?.api?.check?.url || 'https://nps-api.telkom-digital.id/v1/feedback/validation',
        method: rawConfig?.api?.check?.method || 'POST',
      },
    },
    // OTHERS
    customerId: rawConfig?.customerId ?? '',
    surveyId: rawConfig?.surveyId ?? '',
    hideFeedbackButton: rawConfig?.hideFeedbackButton ?? false,
  };

  return {
    get: () => config,
    set: (newConfig: Partial<FeedbackConfig>) => {
      (window as any).FeedbackUs = { ...config, ...newConfig, init };
    },
  };
};
