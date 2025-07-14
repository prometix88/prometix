export interface FeedbackConfig {
  // content survey
  title: string;
  thankyou: string;
  textSubmitted: string;
  textButton: string;
  descriptionScore: string;
  illustration: string;
  followupQuestion: string;

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
    surveyContent: {
      method: string;
      url: string;
    };
  };
  customerId: string;
  surveyId: string;
  hideFeedbackButton: boolean;
}

export const prometixConfig = () => {
  const rawConfig = (window as any).Prometix || {};
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
    followupQuestion: rawConfig?.followupQuestion || 'Apa alasan Anda?',
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
      surveyContent: {
        url: rawConfig?.api?.surveyContent?.url || 'https://nps-api.telkom-digital.id/v1/content',
        method: rawConfig?.api?.surveyContent?.method || 'POST',
      },
    },
    // OTHERS
    customerId: rawConfig?.customerId ?? getOrCreateAnonymousId(),
    surveyId: rawConfig?.surveyId ?? '',
    hideFeedbackButton: rawConfig?.hideFeedbackButton ?? false,
  };

  return {
    get: () => ({ ...rawConfig, ...config } as FeedbackConfig),
    set: (newConfig: Partial<FeedbackConfig>) => {
      (window as any).Prometix = { ...rawConfig, ...config, ...newConfig };
    },
  };
};

export function getOrCreateAnonymousId(): string {
  const rawConfig = (window as any).Prometix || {};
  const KEY = `prometix-anonymous-${rawConfig.surveyId}`;
  const cached = localStorage.getItem(KEY);
  if (cached) {
    const { id, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const oneMonth = 1000 * 60 * 60 * 24 * 30;
    if (age < oneMonth) return id;
  }

  const id = crypto.randomUUID();
  localStorage.setItem(KEY, JSON.stringify({ id, timestamp: Date.now() }));
  return id;
}
