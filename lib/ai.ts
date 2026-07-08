import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// Groq: OpenAI-uyumlu, ücretsiz: 30 RPM, 14.4K istek/gün, çok hızlı
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY || '',
});

// xAI Grok: OpenAI-uyumlu, deneme kredisi
const xai = createOpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY || '',
});

// OpenRouter: OpenAI-uyumlu, ücretsiz modeller (Qwen, Llama, vb.)
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

const ProductContentSchema = z.object({
  seoTitle: z.string().max(100).describe('SEO uyumlu ürün başlığı, maksimum 100 karakter, Trendyol kurallarına uygun'),
  descriptionHtml: z.string().describe('Zengin ürün açıklaması HTML formatında, en az 150 kelime, özellik listesi + fayda odaklı metin'),
  keywords: z.array(z.string()).min(10).describe('En az 10 adet SEO anahtar kelimesi'),
  socialPosts: z.array(z.string()).length(3).describe('3 adet Instagram/Reels tanıtım metni, hashtag\'lerle birlikte'),
});

export type ProductContent = z.infer<typeof ProductContentSchema>;

export interface ProductInput {
  title: string;
  description: string;
  category?: string;
}

function buildPrompt(input: ProductInput): string {
  return `Sen profesyonel bir e-ticaret içerik uzmanısın. Türkiye'deki pazaryerlerine (Trendyol, Hepsiburada, N11) özel ürün içerikleri üretiyorsun.

Ürün Bilgileri:
- Ürün Adı: ${input.title}
- Açıklama: ${input.description}
- Kategori: ${input.category || 'Genel'}

Görevlerin:
1. SEO uyumlu ürün başlığı oluştur (maksimum 100 karakter, Trendyol kurallarına uygun, anahtar kelimeleri doğal bir şekilde içer)
2. Zengin ürün açıklaması yaz (HTML formatında, en az 150 kelime, özellik listesi + fayda odaklı metin, müşteriye doğrudan hitap et)
3. En az 10 adet SEO anahtar kelimesi listele
4. 3 adet Instagram/Reels tanıtım metni yaz (kısa, dikkat çekici, emoji ve hashtag'lerle birlikte)

Önemli kurallar:
- Başlık 100 karakteri aşmamalı
- Açıklama en az 150 kelime olmalı
- Anahtar kelimeler Türkçe ve aranabilir olmalı
- Sosyal medya postları kısa ve etkileyici olmalı
- Tüm içerikler Türkçe yazılmalı`;
}

// 1. Birincil: Google Gemini Flash (ücretsiz: 15 RPM, 1,500 istek/gün)
async function generateWithGemini(input: ProductInput): Promise<ProductContent & { model: string }> {
  const result = await generateObject({
    model: google('gemini-2.0-flash'),
    schema: ProductContentSchema,
    prompt: buildPrompt(input),
  });
  return { ...result.object, model: 'gemini-2.0-flash' };
}

// 2. Yedek: Groq Llama 3.3 70B (ücretsiz: 30 RPM, 14.4K istek/gün, çok hızlı)
async function generateWithGroq(input: ProductInput): Promise<ProductContent & { model: string }> {
  const result = await generateObject({
    model: groq('llama-3.3-70b-versatile'),
    schema: ProductContentSchema,
    prompt: buildPrompt(input),
  });
  return { ...result.object, model: 'groq/llama-3.3-70b-versatile' };
}

// 3. Yedek: xAI Grok 3 (deneme kredisi)
async function generateWithGrok(input: ProductInput): Promise<ProductContent & { model: string }> {
  const result = await generateObject({
    model: xai('grok-3'),
    schema: ProductContentSchema,
    prompt: buildPrompt(input),
  });
  return { ...result.object, model: 'xai/grok-3' };
}

// 4. Yedek: OpenRouter Qwen 3 235B (ücretsiz: 20 RPM, 50/gün)
async function generateWithOpenRouter(input: ProductInput): Promise<ProductContent & { model: string }> {
  const result = await generateObject({
    model: openrouter('qwen/qwen3-235b-a22b:free'),
    schema: ProductContentSchema,
    prompt: buildPrompt(input),
  });
  return { ...result.object, model: 'openrouter/qwen3-235b:free' };
}

// Ana fonksiyon: Gemini → Groq → Grok → OpenRouter fallback zinciri
export async function generateProductContent(input: ProductInput): Promise<ProductContent> {
  const providers = [
    { name: 'Gemini', fn: generateWithGemini, envKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY },
    { name: 'Groq', fn: generateWithGroq, envKey: process.env.GROQ_API_KEY },
    { name: 'xAI Grok', fn: generateWithGrok, envKey: process.env.XAI_API_KEY },
    { name: 'OpenRouter', fn: generateWithOpenRouter, envKey: process.env.OPENROUTER_API_KEY },
  ];

  for (const provider of providers) {
    if (!provider.envKey) continue;

    try {
      const result = await provider.fn(input);
      return result;
    } catch (error) {
      console.error(`${provider.name} failed:`, error);
    }
  }

  throw new Error('Tüm AI servisleri şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
}
