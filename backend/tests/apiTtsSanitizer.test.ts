/**
 * MSKLabsDesk — TTS Sanitizer & Telaffuz Normalizasyon Testi (CMS-TTS-002)
 * File: backend/tests/apiTtsSanitizer.test.ts
 */

import {
  stripHtmlAndMarkdown,
  normalizePronunciation,
  segmentText,
  prepareTtsPayload
} from '../src/utils/ttsSanitizer';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

async function runTests() {
  console.log('--- CMS-TTS-002 TTS Sanitizer & Normalizasyon Testleri Başlatılıyor ---');

  // 1. stripHtmlAndMarkdown Testleri
  const htmlInput = '<h1>Başlık</h1><p>Bu bir <strong>kalın</strong> ve <a href="https://msklabs.org">bağlantılı</a> metindir.</p>```const x = 1;```';
  const cleanHtml = stripHtmlAndMarkdown(htmlInput);
  assert(!cleanHtml.includes('<h1>'), 'HTML etiketleri kaldırıldı');
  assert(!cleanHtml.includes('https://msklabs.org'), 'Markdown / HTML URL kaldırıldı');
  assert(cleanHtml.includes('bağlantılı'), 'Link metni korundu');
  assert(cleanHtml.includes('kalın'), 'Metin içeriği korundu');
  assert(cleanHtml.includes('[kod bloğu]'), 'Kod blokları dönüştürüldü');

  // 2. Türkçe Telaffuz Normalizasyonu Testleri
  const trInput = 'MSK Labs bünyesinde 50 TL ödeme ile 10 km yol gidip 15 dk bekledik, vb. konular için bkz. doküman.';
  const trNormalized = normalizePronunciation(trInput, 'TR');
  assert(trNormalized.includes('M S K Labs'), 'MSK Labs hecelenerek ayrıldı');
  assert(trNormalized.includes('50 Türk Lirası'), 'TL -> Türk Lirası dönüştürüldü');
  assert(trNormalized.includes('10 kilometre'), 'km -> kilometre dönüştürüldü');
  assert(trNormalized.includes('15 dakika'), 'dk -> dakika dönüştürüldü');
  assert(trNormalized.includes('ve benzerleri'), 'vb. -> ve benzerleri dönüştürüldü');
  assert(trNormalized.includes('bakınız'), 'bkz. -> bakınız dönüştürüldü');

  // 3. İngilizce Telaffuz Normalizasyonu Testleri
  const enInput = 'MSK Labs provides services, e.g. API and URL endpoints, etc.';
  const enNormalized = normalizePronunciation(enInput, 'EN');
  assert(enNormalized.includes('M S K Labs'), 'EN MSK Labs normalize edildi');
  assert(enNormalized.includes('for example'), 'e.g. -> for example');
  assert(enNormalized.includes('A P I'), 'API -> A P I');
  assert(enNormalized.includes('U R L'), 'URL -> U R L');
  assert(enNormalized.includes('et cetera'), 'etc. -> et cetera');

  // 4. Arapça Telaffuz ve Hareke Koruma Testi
  const arInput = 'مَرْحَبًا بِكُمْ فِي MSK Labs وَهَذَا نَصٌّ مُشَكَّلٌ.';
  const arNormalized = normalizePronunciation(arInput, 'AR');
  assert(arNormalized.includes('إم إس كي لابس'), 'Arapça MSK Labs transkripsiyonu');
  assert(arNormalized.includes('مَرْحَبًا'), 'Arapça hareke (tashkeel) korundu');

  // 5. Metin Segmentasyonu (Cümle Sınırı ve Paragraf Bölme) Testi
  const longParagraph = 'Birinci cümle burada bitiyor. İkinci cümle devam ediyor. Üçüncü cümle biraz daha uzunca bir anlatım sunuyor! Dördüncü cümle ise son noktayı koyuyor?';
  const segments = segmentText(longParagraph, 60); // 60 karakterlik ufak dilimler
  assert(segments.length >= 3, `Metin mantıksal cümle sınırlarında bölündü (Parça sayısı: ${segments.length})`);
  for (const s of segments) {
    assert(s.length <= 65, `Her segment azami sınır dahilinde: ${s.length} kr`);
  }

  // 6. prepareTtsPayload Bütünleşik Pipeline Testi
  const fullArticle = `
    <h2>Yapay Zeka ve Gelecek</h2>
    <p>MSK Labs olarak geliştirdiğimiz yeni sistemde 100 TL maliyetle 20 dk içinde tüm makaleler seslendiriliyor.</p>
  `;
  const prepared = prepareTtsPayload(fullArticle, 'TR', 200);
  assert(prepared.wordCount > 10, `Kelime sayısı hesaplandı: ${prepared.wordCount}`);
  assert(prepared.estimatedDurationSeconds > 0, `Tahmini okuma süresi: ${prepared.estimatedDurationSeconds} sn`);
  assert(prepared.segments.length >= 1, `Segmentler hazırlandı: ${prepared.segments.length}`);
  assert(prepared.fullSanitizedText.includes('M S K Labs'), 'Tam metinde telaffuz normalize');

  console.log('--- CMS-TTS-002 Testleri Başarıyla Tamamlandı ---');
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
