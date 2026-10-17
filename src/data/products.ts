import { Product } from '@/types/product'

export const PRODUCTS: Product[] = [
  // --- SACS À MAIN & MAROQUINERIE ---
  {
    id: 1,
    name: 'Sac à Main Cuir Noir Élite',
    nameAr: 'حقيبة يد جلدية سوداء فاخرة',
    description:
      'Confectionnée en cuir d’exception avec finitions dorées artisanales. Spacieuse, élégante et résistante pour vos journées actives et soirées habillées.',
    descriptionAr:
      'مصنوعة من جلد ممتاز مع لمسات ذهبية أنيقة. واسعة وعصرية ومتينة تناسب جميع إطلالاتك اليومية والمناسبات الراقية.',
    price: 450,
    originalPrice: 550,
    image: '/logo.jpg',
    category: 'Sacs à Main',
    categoryAr: 'حقائب يد',
    inStock: 12,
    featured: true,
  },
  {
    id: 2,
    name: 'Sac Élégant Doré Royale',
    nameAr: 'حقيبة أنيقة بلمسة ذهبية ملكية',
    description:
      'Design raffiné avec détails dorés scintillants et bandoulière amovible. L’accessoire parfait pour sublimer une tenue de fête.',
    descriptionAr:
      'تصميم مميز مع تفاصيل ذهبية براقة وحزام قابل للتعديل. الإكسسوار المثالي لإبراز أناقتك في الحفلات والمناسبات.',
    price: 550,
    originalPrice: 650,
    image: '/logo.jpg',
    category: 'Sacs de Luxe',
    categoryAr: 'حقائب فاخرة',
    inStock: 8,
    featured: true,
  },
  {
    id: 3,
    name: 'Sac Marron Classique Vintage',
    nameAr: 'حقيبة بنية كلاسيكية كاجوال',
    description:
      'Style intemporel en cuir grainé marron caramel. Plusieurs compartiments intérieurs zippés pour ranger tous vos essentiels en sécurité.',
    descriptionAr:
      'طراز كلاسيكي جذاب بالجلد البني الفاخر. تحتوي على عدة جيوب داخلية بسحاب لتنظيم أغراضك اليومية بكل راحة.',
    price: 380,
    originalPrice: 480,
    image: '/logo.jpg',
    category: 'Sacs à Main',
    categoryAr: 'حقائب يد',
    inStock: 15,
    featured: false,
  },
  {
    id: 4,
    name: 'Sac à Épaule Beige Doux',
    nameAr: 'حقيبة كتف بيج عصرية',
    description:
      'Un modèle minimaliste et léger aux teintes nude beige. Idéal pour apporter une touche de douceur et d’élégance à votre style.',
    descriptionAr:
      'موديل خفيف وبسيط باللون البيج الهادئ. مثالية لإضافة لمسة أنثوية ساحرة وأنيقة لكل ملابسك.',
    price: 420,
    originalPrice: 500,
    image: '/logo.jpg',
    category: 'Sacs à Main',
    categoryAr: 'حقائب يد',
    inStock: 10,
    featured: false,
  },
  {
    id: 5,
    name: 'Sac de Voyage Week-end Noir',
    nameAr: 'حقيبة سفر سوداء للرحلات',
    description:
      'Spacieux, solide et doté d’une anse renforcée pour les courts séjours. Cuir imperméabilisé et design haut de gamme.',
    descriptionAr:
      'حقيبة واسعة ومتينة بمقابض مريحة للرحلات وعطلات نهاية الأسبوع. جلد مقاوم مع تصميم عملي فاخر.',
    price: 650,
    originalPrice: 790,
    image: '/logo.jpg',
    category: 'Sacs de Luxe',
    categoryAr: 'حقائب فاخرة',
    inStock: 6,
    featured: false,
  },
  {
    id: 6,
    name: 'Pochette de Soirée Or Impérial',
    nameAr: 'حقيبة يد صغيرة ذهبية للمساء',
    description:
      'Petite pochette bijou avec fermeture magnétique et chaîne dorée délicate. Indispensable pour vos dîners et célébrations.',
    descriptionAr:
      'حقيبة سهرة صغيرة مرصعة بتفاصيل ساحرة وسلسلة ذهبية أنيقة. لا غنى عنها للسهرات وحفلات الزفاف.',
    price: 280,
    originalPrice: 350,
    image: '/logo.jpg',
    category: 'Pochettes',
    categoryAr: 'حقائب صغيرة',
    inStock: 20,
    featured: false,
  },

  // --- BIJOUX & PARURES (JEWELRY) ---
  {
    id: 7,
    name: 'Collier Pendentif Or & Perle Blanche',
    nameAr: 'قلادة ذهبية مرصعة بلؤلؤة نقية',
    description:
      'Collier plaqué or 18k délicat, orné d’une perle naturelle sélectionnée à la main. Un éclat subtil et intemporel autour de votre cou.',
    descriptionAr:
      'عقد فاخر مطلي بالذهب عيار 18 قيراط مع لؤلؤة طبيعية براقة. يمنح عنقك لمسة ناعمة تسحر الأنظار في كل وقت.',
    price: 290,
    originalPrice: 380,
    image: '/logo.jpg',
    category: 'Bijoux & Parures',
    categoryAr: 'مجوهرات وحلي',
    inStock: 14,
    featured: true,
  },
  {
    id: 8,
    name: 'Bracelet Jonc Doré Étoile Royale',
    nameAr: 'سوار ذهبي ملكي مفتوح مرصع بالزركون',
    description:
      'Jonc ajustable en acier inoxydable doré, orné de cristaux étincelants. Résiste à l’eau et conserve son éclat au fil du temps.',
    descriptionAr:
      'سوار أنيق قابل للتعديل ومقاوم للماء من الفولاذ الذهبي مع فصوص زركون لامعة لا تفقد بريقها.',
    price: 240,
    originalPrice: 320,
    image: '/logo.jpg',
    category: 'Bijoux & Parures',
    categoryAr: 'مجوهرات وحلي',
    inStock: 18,
    featured: true,
  },
  {
    id: 9,
    name: 'Boucles d’Oreilles Goutte Dorée',
    nameAr: 'أقراط متدلية بتصميم قطرة الذهب',
    description:
      'Légères et lumineuses, ces boucles d’oreilles pendantes épousent harmonieusement les contours du visage pour un port agréable toute la journée.',
    descriptionAr:
      'أقراط خفيفة وجذابة بتصميم قطرة انسيابي يمنح إطلالتك فخامة وسحراً استثنائياً طوال اليوم.',
    price: 180,
    originalPrice: 250,
    image: '/logo.jpg',
    category: 'Bijoux & Parures',
    categoryAr: 'مجوهرات وحلي',
    inStock: 25,
    featured: false,
  },
  {
    id: 10,
    name: 'Bague Royale Sertie Émeraude',
    nameAr: 'خاتم ملكي مرصع بحجر أخضر زمردي',
    description:
      'Bague d’inspiration haute joaillerie avec pierre centrale vert émeraude facettée, entourée d’un halo de brillants.',
    descriptionAr:
      'خاتم فخم بتصميم ملكي يحتوي على حجر زمردي أخضر في المنتصف محاط بأحجار براقة دقيقة.',
    price: 220,
    originalPrice: 290,
    image: '/logo.jpg',
    category: 'Bijoux & Parures',
    categoryAr: 'مجوهرات وحلي',
    inStock: 16,
    featured: true,
  },

  // --- MONTRES & ACCESSOIRES ---
  {
    id: 11,
    name: 'Montre Dorée Cadran Nacre Luxe',
    nameAr: 'ساعة نسائية ذهبية بميناء صدف أنيق',
    description:
      'Mouvement à quartz de haute précision avec bracelet à maillons dorés et cadran en nacre véritable. Le summum du chic féminin.',
    descriptionAr:
      'ساعة يد نسائية دقيقة مع حزام من الستانلس ستيل الذهبي وميناء صدف طبيعي أنيق يناسب كل المناسبات.',
    price: 490,
    originalPrice: 620,
    image: '/logo.jpg',
    category: 'Montres & Accessoires',
    categoryAr: 'ساعات وإكسسوارات',
    inStock: 9,
    featured: true,
  },
  {
    id: 12,
    name: 'Ceinture Chaîne Dorée Glamour',
    nameAr: 'حزام سلسلة ذهبية فاخر للقفطان',
    description:
      'Ceinture bijou ajustable avec médaillons gravés, conçue pour sublimer vos caftans, djellabas ou robes de soirée.',
    descriptionAr:
      'حزام عصري راقٍ على شكل سلسلة ذهبية مرصعة بنقوش جميلة لتزيين القفطان والجلابة والفساتين.',
    price: 210,
    originalPrice: 280,
    image: '/logo.jpg',
    category: 'Montres & Accessoires',
    categoryAr: 'ساعات وإكسسوارات',
    inStock: 15,
    featured: false,
  },
]

export function getAllProducts(): Product[] {
  return PRODUCTS
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured)
}

export function getProductById(id: number | string): Product | undefined {
  const idStr = id.toString()
  return PRODUCTS.find((p) => p.id.toString() === idStr)
}

export function getCategories(language: 'fr' | 'ar'): { key: string; label: string }[] {
  const isAr = language === 'ar'
  const uniqueCategories = Array.from(
    new Set(PRODUCTS.map((p) => (isAr ? p.categoryAr : p.category)))
  )
  return [
    { key: 'all', label: isAr ? 'الكل' : 'Tous' },
    ...uniqueCategories.map((c) => ({ key: c, label: c })),
  ]
}
