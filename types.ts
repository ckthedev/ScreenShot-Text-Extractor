
export interface Translations {
  Hindi: string;
  Tamil: string;
  Malayalam: string;
  Telugu: string;
  English: string;
}

export interface ProcessedTextResult {
  extracted_text: string;
  cleaned_text: string;
  summary: string;
  translations: Translations;
}

export const LanguageMap: Record<keyof Translations, string> = {
  English: "English",
  Hindi: "Hindi",
  Tamil: "Tamil",
  Malayalam: "Malayalam",
  Telugu: "Telugu"
};
