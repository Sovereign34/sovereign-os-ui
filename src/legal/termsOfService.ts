// src/legal/termsOfService.ts
// R-3 — AI karar sorumluluğu ("tavsiye niteliğindedir")
// R-6 — Team tier fair use hard cap
// 4 dil: EN / TR / DE / JA
// ADAPTERv1 Session 8

export type LegalLang = "en" | "tr" | "de" | "ja";

export const termsOfService: Record<LegalLang, string> = {

// ─────────────────────────────────────────────────────────────────────────────
en: `TERMS OF SERVICE
Sovereign Engine OS
Last updated: June 4, 2026

──────────────────────────────────────────────
1. ACCEPTANCE OF TERMS
──────────────────────────────────────────────
By creating an account or using Sovereign Engine OS ("Service"), you agree to
these Terms of Service ("Terms"). If you do not agree, do not use the Service.

──────────────────────────────────────────────
2. DESCRIPTION OF SERVICE
──────────────────────────────────────────────
Sovereign Engine OS is a domain-agnostic AI decision engine that helps users
structure, evaluate, and document decisions. The Service is provided "as is"
and is intended for informational and productivity purposes only.

──────────────────────────────────────────────
3. AI DECISIONS — ADVISORY NATURE (R-3)
──────────────────────────────────────────────
ALL outputs produced by the Service, including decisions, recommendations,
analyses, and any other AI-generated content, are ADVISORY IN NATURE ONLY.

  • The Service does not provide legal, financial, medical, or professional advice.
  • No output should be treated as a final or binding decision.
  • You are solely responsible for evaluating outputs and for any actions
    taken based on them.
  • Sovereign Engine OS and its operators accept no liability for losses,
    damages, or consequences arising from reliance on AI-generated outputs.

By using the Service, you acknowledge that human judgment remains essential
and that you will not rely on AI outputs without independent verification.

──────────────────────────────────────────────
4. SUBSCRIPTION TIERS & FAIR USE (R-6)
──────────────────────────────────────────────
The Service offers the following subscription tiers:

  Free   — $0/mo    | 50 decisions/mo   | 1 adapter  | 1 project
  Solo   — $29/mo   | 500 decisions/mo  | 3 adapters | 3 projects
  Pro    — $79/mo   | 5,000 decisions/mo| 10 adapters| 10 projects
  Team   — $199/mo  | Unlimited decisions| Unlimited  | Unlimited

TEAM TIER FAIR USE HARD CAP:
The Team tier is subject to a fair use limit of $500 USD per month in
underlying API costs per account. If your usage approaches or exceeds this
threshold, we will contact you to discuss custom Enterprise pricing.
Accounts that consistently exceed fair use limits may be suspended or
migrated to an Enterprise plan.

──────────────────────────────────────────────
5. ACCEPTABLE USE
──────────────────────────────────────────────
You agree not to use the Service to:
  • Violate any applicable law or regulation.
  • Generate content intended to deceive, defraud, or harm others.
  • Circumvent usage limits, rate limits, or access controls.
  • Resell or redistribute the Service without written authorization.

──────────────────────────────────────────────
6. INTELLECTUAL PROPERTY
──────────────────────────────────────────────
The Service, its underlying engine, and all associated documentation are the
intellectual property of Sovereign Engine OS and its operators. You retain
ownership of content you provide as input (master plans, adapter definitions).

──────────────────────────────────────────────
7. DATA & PRIVACY
──────────────────────────────────────────────
Use of the Service is also governed by our Privacy Policy. You may request
deletion of all personal data at any time via Settings → Delete My Data.

──────────────────────────────────────────────
8. TERMINATION
──────────────────────────────────────────────
We reserve the right to suspend or terminate accounts that violate these Terms,
abuse the Service, or exceed fair use limits without prior arrangement.

──────────────────────────────────────────────
9. LIMITATION OF LIABILITY
──────────────────────────────────────────────
TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOVEREIGN ENGINE OS AND ITS OPERATORS
SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL
DAMAGES, INCLUDING LOSS OF PROFITS OR DATA, ARISING FROM USE OF THE SERVICE.

──────────────────────────────────────────────
10. CHANGES TO TERMS
──────────────────────────────────────────────
We may update these Terms at any time. Continued use of the Service after
changes are posted constitutes acceptance of the revised Terms.

──────────────────────────────────────────────
11. GOVERNING LAW
──────────────────────────────────────────────
These Terms are governed by applicable law. Any disputes shall be resolved
through binding arbitration or the courts of the applicable jurisdiction.

──────────────────────────────────────────────
12. CONTACT
──────────────────────────────────────────────
For questions about these Terms, contact us through the Service dashboard.`,

// ─────────────────────────────────────────────────────────────────────────────
tr: `HİZMET KOŞULLARI
Sovereign Engine OS
Son güncelleme: 4 Haziran 2026

──────────────────────────────────────────────
1. KOŞULLARIN KABULÜ
──────────────────────────────────────────────
Sovereign Engine OS ("Hizmet") üzerinde hesap oluşturarak veya Hizmet'i
kullanarak bu Hizmet Koşullarını ("Koşullar") kabul etmiş sayılırsınız.
Kabul etmiyorsanız Hizmet'i kullanmayınız.

──────────────────────────────────────────────
2. HİZMETİN TANIMI
──────────────────────────────────────────────
Sovereign Engine OS, kullanıcıların kararlarını yapılandırmasına, değerlendirmesine
ve belgelemesine yardımcı olan, domain-agnostik bir yapay zeka karar motorudur.
Hizmet "olduğu gibi" sunulmakta olup yalnızca bilgilendirme ve üretkenlik
amaçlı kullanım için tasarlanmıştır.

──────────────────────────────────────────────
3. YAPAY ZEKA KARARLARI — TAVSİYE NİTELİĞİ (R-3)
──────────────────────────────────────────────
Hizmet tarafından üretilen TÜM çıktılar; kararlar, öneriler, analizler ve
diğer tüm yapay zeka içerikleri YALNIZCA TAVSİYE NİTELİĞİNDEDİR.

  • Hizmet; hukuki, finansal, tıbbi veya mesleki tavsiye sunmamaktadır.
  • Hiçbir çıktı, nihai veya bağlayıcı bir karar olarak değerlendirilemez.
  • Çıktıları değerlendirmekten ve bu çıktılara dayanılarak alınan
    kararlardan yalnızca siz sorumlusunuz.
  • Sovereign Engine OS ve operatörleri, yapay zeka çıktılarına güvenilmesi
    sonucunda ortaya çıkan kayıp, hasar veya sonuçlardan sorumlu tutulamaz.

Hizmet'i kullanarak, insan yargısının vazgeçilmez olduğunu ve yapay zeka
çıktılarını bağımsız doğrulama yapmaksızın esas almayacağınızı kabul
etmiş sayılırsınız.

──────────────────────────────────────────────
4. ABONELİK KADEMELERİ VE ADIL KULLANIM (R-6)
──────────────────────────────────────────────
Hizmet aşağıdaki abonelik kademelerini sunmaktadır:

  Free   — $0/ay   | 50 karar/ay    | 1 adapter  | 1 proje
  Solo   — $29/ay  | 500 karar/ay   | 3 adapter  | 3 proje
  Pro    — $79/ay  | 5.000 karar/ay | 10 adapter | 10 proje
  Team   — $199/ay | Sınırsız karar | Sınırsız   | Sınırsız

TEAM KADEMESİ ADİL KULLANIM SINIRI:
Team kademesi, hesap başına aylık $500 ABD Doları temel API maliyeti adil
kullanım sınırına tabidir. Kullanımınızın bu eşiğe yaklaşması veya aşması
durumunda özel Kurumsal fiyatlandırma görüşmesi için sizinle iletişime
geçeceğiz. Adil kullanım sınırını sürekli aşan hesaplar askıya alınabilir
veya Kurumsal plana taşınabilir.

──────────────────────────────────────────────
5. KABUL EDİLEBİLİR KULLANIM
──────────────────────────────────────────────
Hizmet'i aşağıdaki amaçlarla kullanmamayı kabul edersiniz:
  • Geçerli herhangi bir yasa veya yönetmeliği ihlal etmek.
  • Başkalarını aldatmaya, dolandırmaya veya zarar vermeye yönelik
    içerik üretmek.
  • Kullanım limitlerini, hız sınırlarını veya erişim kontrollerini
    devre dışı bırakmak.
  • Yazılı izin olmaksızın Hizmet'i yeniden satmak veya dağıtmak.

──────────────────────────────────────────────
6. FİKRİ MÜLKİYET
──────────────────────────────────────────────
Hizmet, altta yatan motor ve ilgili tüm belgeler, Sovereign Engine OS ve
operatörlerinin fikri mülkiyetidir. Girdi olarak sağladığınız içerikler
(master planlar, adapter tanımları) size ait olmaya devam eder.

──────────────────────────────────────────────
7. VERİ VE GİZLİLİK
──────────────────────────────────────────────
Hizmet'in kullanımı Gizlilik Politikamız kapsamındadır. Kişisel verilerinizin
silinmesini istediğiniz zaman Ayarlar → Verilerimi Sil yolu ile talep edebilirsiniz.

──────────────────────────────────────────────
8. HESAP ASKIYA ALMA VE SONLANDIRMA
──────────────────────────────────────────────
Bu Koşulları ihlal eden, Hizmet'i kötüye kullanan veya önceden düzenleme
yapmaksızın adil kullanım sınırını aşan hesapları askıya alma ya da
sonlandırma hakkımızı saklı tutarız.

──────────────────────────────────────────────
9. SORUMLULUĞUN SINIRLANDIRILMASI
──────────────────────────────────────────────
YÜRÜRLÜKTEKI YASANIN İZİN VERDİĞİ AZAMİ ÖLÇÜDE, SOVEREIGN ENGINE OS VE
OPERATÖRLERİ; HİZMET'İN KULLANIMINDAN KAYNAKLANAN DOLAYLI, ARIZİ, ÖZEL
VEYA SONUÇSAL HİÇBİR ZARARDAN, KAR VEYA VERİ KAYBINDAN SORUMLU TUTULAMAZ.

──────────────────────────────────────────────
10. KOŞULLARDA DEĞİŞİKLİK
──────────────────────────────────────────────
Bu Koşulları istediğimiz zaman güncelleyebiliriz. Değişikliklerin yayımlanmasının
ardından Hizmet'i kullanmaya devam etmeniz, revize edilmiş Koşulları kabul
ettiğiniz anlamına gelir.

──────────────────────────────────────────────
11. UYGULANACAK HUKUK
──────────────────────────────────────────────
Bu Koşullar yürürlükteki hukuka tabidir. Uyuşmazlıklar, bağlayıcı tahkim
veya yetkili mahkemeler aracılığıyla çözülür.

──────────────────────────────────────────────
12. İLETİŞİM
──────────────────────────────────────────────
Bu Koşullar hakkındaki sorularınız için Hizmet kontrol paneli üzerinden
bizimle iletişime geçebilirsiniz.`,

// ─────────────────────────────────────────────────────────────────────────────
de: `NUTZUNGSBEDINGUNGEN
Sovereign Engine OS
Zuletzt aktualisiert: 4. Juni 2026

──────────────────────────────────────────────
1. ZUSTIMMUNG ZU DEN BEDINGUNGEN
──────────────────────────────────────────────
Durch die Erstellung eines Kontos oder die Nutzung von Sovereign Engine OS
("Dienst") stimmen Sie diesen Nutzungsbedingungen ("Bedingungen") zu.
Wenn Sie nicht zustimmen, nutzen Sie den Dienst bitte nicht.

──────────────────────────────────────────────
2. BESCHREIBUNG DES DIENSTES
──────────────────────────────────────────────
Sovereign Engine OS ist eine domänenagnostische KI-Entscheidungsmaschine, die
Benutzern hilft, Entscheidungen zu strukturieren, zu bewerten und zu
dokumentieren. Der Dienst wird „wie besehen" bereitgestellt und ist
ausschließlich für Informations- und Produktivitätszwecke bestimmt.

──────────────────────────────────────────────
3. KI-ENTSCHEIDUNGEN — EMPFEHLUNGSCHARAKTER (R-3)
──────────────────────────────────────────────
ALLE vom Dienst erzeugten Ausgaben — einschließlich Entscheidungen,
Empfehlungen, Analysen und sonstiger KI-generierter Inhalte — sind
AUSSCHLIESSLICH EMPFEHLENDER NATUR.

  • Der Dienst bietet keine rechtliche, finanzielle, medizinische oder
    sonstige professionelle Beratung.
  • Keine Ausgabe darf als endgültige oder verbindliche Entscheidung
    betrachtet werden.
  • Sie sind allein verantwortlich für die Bewertung der Ausgaben und
    für alle darauf basierenden Handlungen.
  • Sovereign Engine OS und seine Betreiber übernehmen keine Haftung für
    Verluste, Schäden oder Folgen, die aus dem Vertrauen auf KI-generierte
    Ausgaben entstehen.

Mit der Nutzung des Dienstes bestätigen Sie, dass menschliches Urteilsvermögen
unerlässlich bleibt und dass Sie KI-Ausgaben nicht ohne unabhängige Überprüfung
als Grundlage verwenden werden.

──────────────────────────────────────────────
4. ABONNEMENTSTUFEN UND FAIRE NUTZUNG (R-6)
──────────────────────────────────────────────
Der Dienst bietet folgende Abonnementpläne:

  Free   — $0/Monat  | 50 Entsch./Monat    | 1 Adapter  | 1 Projekt
  Solo   — $29/Monat | 500 Entsch./Monat   | 3 Adapter  | 3 Projekte
  Pro    — $79/Monat | 5.000 Entsch./Monat | 10 Adapter | 10 Projekte
  Team   — $199/Monat| Unbegrenzt          | Unbegrenzt | Unbegrenzt

FAIR-USE-OBERGRENZE FÜR DEN TEAM-TARIF:
Der Team-Tarif unterliegt einer Fair-Use-Grenze von 500 USD pro Monat an
zugrunde liegenden API-Kosten pro Konto. Wenn Ihre Nutzung diese Schwelle
erreicht oder überschreitet, werden wir uns mit Ihnen in Verbindung setzen,
um individuelle Enterprise-Preise zu besprechen. Konten, die die Fair-Use-
Grenzen dauerhaft überschreiten, können gesperrt oder auf einen
Enterprise-Plan umgestellt werden.

──────────────────────────────────────────────
5. ZULÄSSIGE NUTZUNG
──────────────────────────────────────────────
Sie verpflichten sich, den Dienst nicht zu folgenden Zwecken zu nutzen:
  • Verstoß gegen geltendes Recht oder Vorschriften.
  • Erstellung von Inhalten, die darauf abzielen, andere zu täuschen,
    zu betrügen oder zu schädigen.
  • Umgehung von Nutzungslimits, Ratenbeschränkungen oder Zugriffskontrollen.
  • Weiterverkauf oder Weitergabe des Dienstes ohne schriftliche Genehmigung.

──────────────────────────────────────────────
6. GEISTIGES EIGENTUM
──────────────────────────────────────────────
Der Dienst, die zugrunde liegende Engine und alle zugehörigen Dokumente sind
geistiges Eigentum von Sovereign Engine OS und seinen Betreibern. Sie behalten
das Eigentum an den von Ihnen als Eingabe bereitgestellten Inhalten
(Masterpläne, Adapter-Definitionen).

──────────────────────────────────────────────
7. DATEN UND DATENSCHUTZ
──────────────────────────────────────────────
Die Nutzung des Dienstes unterliegt auch unserer Datenschutzrichtlinie.
Sie können jederzeit die Löschung aller personenbezogenen Daten über
Einstellungen → Meine Daten löschen beantragen.

──────────────────────────────────────────────
8. KÜNDIGUNG
──────────────────────────────────────────────
Wir behalten uns das Recht vor, Konten zu sperren oder zu kündigen, die gegen
diese Bedingungen verstoßen, den Dienst missbrauchen oder Fair-Use-Grenzen
ohne vorherige Vereinbarung überschreiten.

──────────────────────────────────────────────
9. HAFTUNGSBESCHRÄNKUNG
──────────────────────────────────────────────
IM GESETZLICH MAXIMAL ZULÄSSIGEN UMFANG HAFTEN SOVEREIGN ENGINE OS UND SEINE
BETREIBER NICHT FÜR INDIREKTE, ZUFÄLLIGE, BESONDERE ODER FOLGESCHÄDEN,
EINSCHLIESSLICH ENTGANGENER GEWINNE ODER DATENVERLUSTE, DIE AUS DER NUTZUNG
DES DIENSTES ENTSTEHEN.

──────────────────────────────────────────────
10. ÄNDERUNGEN DER BEDINGUNGEN
──────────────────────────────────────────────
Wir können diese Bedingungen jederzeit aktualisieren. Die fortgesetzte Nutzung
des Dienstes nach der Veröffentlichung von Änderungen gilt als Zustimmung zu
den überarbeiteten Bedingungen.

──────────────────────────────────────────────
11. ANWENDBARES RECHT
──────────────────────────────────────────────
Diese Bedingungen unterliegen dem anwendbaren Recht. Streitigkeiten werden
durch verbindliche Schiedsverfahren oder die zuständigen Gerichte beigelegt.

──────────────────────────────────────────────
12. KONTAKT
──────────────────────────────────────────────
Bei Fragen zu diesen Bedingungen kontaktieren Sie uns über das Dienst-Dashboard.`,

// ─────────────────────────────────────────────────────────────────────────────
ja: `利用規約
Sovereign Engine OS
最終更新日：2026年6月4日

──────────────────────────────────────────────
1. 規約への同意
──────────────────────────────────────────────
Sovereign Engine OS（以下「本サービス」）のアカウントを作成し、または本サービスを
利用することにより、お客様はこの利用規約（以下「本規約」）に同意したものとみなされます。
同意されない場合は、本サービスをご利用にならないでください。

──────────────────────────────────────────────
2. サービスの概要
──────────────────────────────────────────────
Sovereign Engine OS は、ユーザーが意思決定を構造化・評価・文書化するための
ドメイン非依存型 AI 意思決定エンジンです。本サービスは「現状のまま」提供され、
情報提供および生産性向上を目的とした利用のみを想定しています。

──────────────────────────────────────────────
3. AI による意思決定 — 助言としての性質（R-3）
──────────────────────────────────────────────
本サービスが生成するすべての出力（意思決定、推奨事項、分析、その他すべての
AI 生成コンテンツを含む）は、あくまでも「助言」としての性質を有するにとどまります。

  • 本サービスは、法的・財務的・医療的またはその他の専門的なアドバイスを
    提供するものではありません。
  • いかなる出力も、最終的または拘束力のある決定として扱うべきではありません。
  • 出力の評価、およびそれに基づいてとられる行動については、
    お客様が単独で責任を負います。
  • Sovereign Engine OS およびその運営者は、AI 生成出力への依拠から生じる
    損失、損害、または結果について一切の責任を負いません。

本サービスを利用することにより、お客様は人間の判断が不可欠であることを認め、
独立した検証なしに AI 出力を根拠としないことに同意したものとみなされます。

──────────────────────────────────────────────
4. サブスクリプションプランと公正利用（R-6）
──────────────────────────────────────────────
本サービスは以下のサブスクリプションプランを提供しています。

  Free   — $0/月   | 意思決定 50件/月    | 1 アダプター | 1 プロジェクト
  Solo   — $29/月  | 意思決定 500件/月   | 3 アダプター | 3 プロジェクト
  Pro    — $79/月  | 意思決定 5,000件/月 | 10 アダプター| 10 プロジェクト
  Team   — $199/月 | 無制限              | 無制限       | 無制限

Team プランの公正利用上限：
Team プランは、アカウントごとに月額 500 米ドルの基盤 API コストを公正利用上限と
しています。利用量がこの閾値に近づく、または超過した場合、カスタムエンタープライズ
料金についてご連絡いたします。公正利用上限を継続的に超過するアカウントは、
停止またはエンタープライズプランへの移行の対象となる場合があります。

──────────────────────────────────────────────
5. 許容される利用
──────────────────────────────────────────────
お客様は、本サービスを以下の目的で使用しないことに同意します。
  • 適用される法律または規制に違反すること。
  • 他者を欺き、詐取し、または危害を加えることを目的とするコンテンツを生成すること。
  • 利用制限、レート制限、またはアクセス制御を回避すること。
  • 書面による許可なく本サービスを再販または再配布すること。

──────────────────────────────────────────────
6. 知的財産
──────────────────────────────────────────────
本サービス、その基盤エンジン、および関連するすべてのドキュメントは、
Sovereign Engine OS およびその運営者の知的財産です。お客様が入力として提供した
コンテンツ（マスタープラン、アダプター定義）の所有権はお客様に帰属します。

──────────────────────────────────────────────
7. データとプライバシー
──────────────────────────────────────────────
本サービスの利用はプライバシーポリシーにも準拠します。個人データの削除は、
設定 → データを削除 からいつでも請求できます。

──────────────────────────────────────────────
8. 解約・停止
──────────────────────────────────────────────
本規約に違反したアカウント、本サービスを悪用したアカウント、または事前の取り決め
なしに公正利用上限を超過したアカウントを停止または解約する権利を留保します。

──────────────────────────────────────────────
9. 責任の制限
──────────────────────────────────────────────
適用法が許容する最大限の範囲において、SOVEREIGN ENGINE OS およびその運営者は、
本サービスの利用から生じる間接的・偶発的・特別または派生的な損害（利益の喪失や
データの喪失を含む）について一切責任を負いません。

──────────────────────────────────────────────
10. 規約の変更
──────────────────────────────────────────────
本規約はいつでも更新される場合があります。変更が掲示された後も本サービスを
継続して利用することは、改訂された規約への同意とみなされます。

──────────────────────────────────────────────
11. 準拠法
──────────────────────────────────────────────
本規約は適用法に準拠します。紛争は拘束力のある仲裁または管轄裁判所を通じて解決されます。

──────────────────────────────────────────────
12. お問い合わせ
──────────────────────────────────────────────
本規約に関するご質問は、サービスダッシュボードよりお問い合わせください。`,
};

// Dil tespiti için yardımcı — i18next lang koduyla uyumlu
export function getTosLang(lang: string): LegalLang {
  const map: Record<string, LegalLang> = {
    en: "en", "en-US": "en", "en-GB": "en",
    tr: "tr", "tr-TR": "tr",
    de: "de", "de-DE": "de", "de-AT": "de", "de-CH": "de",
    ja: "ja", "ja-JP": "ja",
  };
  return map[lang] ?? "en";
}
