import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Ana Sayfa', href: '/' },
    { text: 'Hizmetlerimiz', href: getPermalink('/#hizmetlerimiz') },

    {
      text: 'Blog',
      links: [
        { text: 'Genel', href: getPermalink('/blog') },
        { text: 'Yazılım Mühendisliği', href: getPermalink('/category/yazilim-muhendisligi') },
        { text: 'Algoritmalar', href: getPermalink('/category/algoritmalar') },
        { text: 'Bulut', href: getPermalink('/category/bulut') },
        { text: 'Siber Güvenlik', href: getPermalink('/category/siber-guvenlik') },
        { text: 'Performans', href: getPermalink('/category/performans') },
        { text: 'Yazılım Geliştirme', href: getPermalink('/category/yazilim-gelistirme') },
        { text: 'Yazılım', href: getPermalink('/category/yazilim') },
        { text: 'Veri Bilimi', href: getPermalink('/category/veri-bilimi') },
        { text: 'Yapay Zeka', href: getPermalink('/category/yapay-zeka') },
        { text: 'Yazılım Güvenliği', href: getPermalink('/category/yazilim-guvenligi') },
      ],
    },
    /*
    {
      text: 'Sayfalar',
      links: [
        { text: 'Özellikler', href: getPermalink('/#features') },
        { text: 'Hizmetler', href: getPermalink('/services') },
        { text: 'Fiyatlandırma', href: getPermalink('/pricing') },
        { text: 'Hakkımızda', href: getPermalink('/about') },
        { text: 'İletişim', href: getPermalink('/contact') },
        { text: 'Referanslar', href: getPermalink('/testimonials') },
      ],
    },
    */
    {
      text: 'Yasal',
      links: [
        { text: 'Kullanım Koşulları', href: getPermalink('/terms') },
        { text: 'Gizlilik Politikası', href: getPermalink('/privacy') },
      ],
    },
  ],
  actions: [{ text: 'İletişim', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'Menü',
      links: [
        { text: 'Ana Sayfa', href: getPermalink('/') },
        { text: 'Hizmetlerimiz', href: getPermalink('/#hizmetlerimiz') },
        { text: 'Blog', href: getPermalink('/blog') },
        { text: 'Hakkımızda', href: getPermalink('/about') },
        { text: 'İletişim', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Blog',
      links: [
        { text: 'Genel', href: getPermalink('/blog') },
        { text: 'Yazılım Mühendisliği', href: getPermalink('/category/yazilim-muhendisligi') },
        { text: 'Algoritmalar', href: getPermalink('/category/algoritmalar') },
        { text: 'Bulut', href: getPermalink('/category/bulut') },
        { text: 'Siber Güvenlik', href: getPermalink('/category/siber-guvenlik') },
        { text: 'Performans', href: getPermalink('/category/performans') },
        { text: 'Yazılım Geliştirme', href: getPermalink('/category/yazilim-gelistirme') },
        { text: 'Yazılım', href: getPermalink('/category/yazilim') },
        { text: 'Veri Bilimi', href: getPermalink('/category/veri-bilimi') },
        { text: 'Yapay Zeka', href: getPermalink('/category/yapay-zeka') },
        { text: 'Yazılım Güvenliği', href: getPermalink('/category/yazilim-guvenligi') },
      ],
    },
    {
      title: 'Sayfalar',
      links: [
        { text: 'Özellikler', href: getPermalink('/#features') },
        { text: 'Hizmetler', href: getPermalink('/services') },
        { text: 'Fiyatlandırma', href: getPermalink('/pricing') },
        { text: 'Referanslar', href: getPermalink('/testimonials') },
      ],
    },
    {
      title: 'Yasal',
      links: [
        { text: 'Kullanım Koşulları', href: getPermalink('/terms') },
        { text: 'Gizlilik Politikası', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Kullanım Koşulları', href: getPermalink('/terms') },
    { text: 'Gizlilik Politikası', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://twitter.com/bgs' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://instagram.com/bgs' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://facebook.com/bgs' },
  ],
  footNote: `
    Made by <a class="text-purple-600 dark:text-muted no-underline" href="https://EmaDocs.com/">EmaDocs</a> · Tüm hakları saklıdır.
  `,
};
