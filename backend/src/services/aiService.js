import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

export const generateHealthInsight = async ({ userProfile, fastestAqi, aeroAqi, durationFastest, durationAero }) => {
  try {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY belum dikonfigurasi.');
    }

    const ai = new GoogleGenerativeAI(config.geminiApiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
  Kamu adalah asisten informasi kualitas udara dan rute untuk aplikasi "AeroPath". Jangan mendiagnosis atau menjanjikan hasil medis.
  Analisis data perjalanan berikut dan berikan respons HANYA dalam bentuk JSON valid (tanpa markdown, tanpa kata pembuka/penutup):

    Data Perjalanan:
    - Profil Medis User: ${userProfile || 'Sensitif / Asma'}
    - Rute Tercepat: Durasi ${durationFastest} menit, AQI ${fastestAqi} (Polusi Tinggi)
    - AeroRoute (Rute Hijau): Durasi ${durationAero} menit, AQI ${aeroAqi} (Koridor Hijau & Bersih)

    Format output JSON yang WAJIB kamu hasilkan:
    {
      "inhalation_reduction_percent": 38,
      "exposure_score_percent": 62,
      "recommendation_reason": "AI membelokkan rute Anda menjauhi persimpangan padat yang mengalami stagnasi polusi. Melesat lewat koridor teduh pepohonan Senayan yang menurunkan konsentrasi partikel mikro hingga 38% lebih bersih.",
      "ai_alert_warning": "Sangat disarankan memakai AeroRoute! Penderita Asma berisiko tinggi mengalami sesak napas jika melewati rute tercepat yang terpolusi tinggi."
    }
    `;

    const response = await model.generateContent(prompt);

    const responseText = response.response.text().trim();
    const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const insight = JSON.parse(cleanedJson);
    if (
      typeof insight.inhalation_reduction_percent !== 'number' ||
      typeof insight.exposure_score_percent !== 'number' ||
      typeof insight.recommendation_reason !== 'string' ||
      typeof insight.ai_alert_warning !== 'string'
    ) {
      throw new Error('Format respons AI tidak valid.');
    }

    return { ...insight, source: 'gemini', isFallback: false };

  } catch (error) {
    console.error('Error Gemini AI SDK (Using Fallback Data):', error.message);
    return {
      inhalation_reduction_percent: 38,
      exposure_score_percent: 62,
      recommendation_reason: "AI merekomendasikan Rute Lower Exposure untuk Anda yang sensitif terhadap polusi udara. Meskipun butuh 7 menit lebih lama, estimasi polutan terhirup 38% lebih rendah berkat sirkulasi vegetasi koridor hijau.",
      ai_alert_warning: "Estimasi AQI rute tercepat lebih tinggi. Pertimbangkan rute dengan kualitas udara lebih baik; informasi ini bukan diagnosis medis.",
      source: 'fallback',
      isFallback: true
    };
  }
};