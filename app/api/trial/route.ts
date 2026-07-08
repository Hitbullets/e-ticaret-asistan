import { NextRequest, NextResponse } from 'next/server';
import { generateProductContent } from '@/lib/ai';
import { sendTrialEmail } from '@/lib/email';

// Varsayım: Her e-posta adresi için ücretsiz deneme limiti 1
// Basit kontrol: rate limit için DB gerekmez MVP, sadece AI çağrısı yapılır

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, description, category, email } = body;

    if (!productName || !description || !email) {
      return NextResponse.json(
        { error: 'Ürün adı, açıklama ve e-posta zorunludur.' },
        { status: 400 }
      );
    }

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Geçersiz e-posta adresi.' }, { status: 400 });
    }

    // AI ile içerik üret
    const content = await generateProductContent({
      title: productName,
      description,
      category,
    });

    // E-posta ile gönder
    await sendTrialEmail(email, productName, content);

    return NextResponse.json(content);
  } catch (error) {
    // Detaylı hata loglaması (sunucu tarafında görünür)
    if (error instanceof Error) {
      console.error('Trial generation error:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Trial generation unknown error:', error);
    }
    return NextResponse.json(
      { error: 'İçerik üretilirken bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
