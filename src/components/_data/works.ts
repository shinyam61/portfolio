export type Link = {
  url: string
  txt: string
}
type Work = {
  id: string
  name: string
  desc: string
  note: string
  href: string | Link[] 
  anchors: string[]
}


export const works: Work[] = [
  {
    id: 'dtac',
    name: 'DTAC Corporate',
    desc: '沖縄で事業を展開しているdtac社のコーポレートサイトです。',
    note: '',
    href: 'https://www.dtac.tokyo/',
    anchors: ['', 'top', 'who', 'what', 'company', 'ceo', 'where'],
  },
  {
    id: 'pist6',
    name: 'Pist6',
    desc: '千葉市が運営している公営競技のポータルサイトと、運営会社のコーポレートサイトです。',
    note: '',
    href: [
      {
        url: 'https://www.pist6.com/',
        txt: 'Pist6 ポータルサイト'
      },
      {
        url: 'https://pist6.co.jp/',
        txt: 'Pist6 コーポレート'
      }
    ],
    anchors: ['', 'kv', 'news', 'information', 'content', 'access', 'sponsor'],
  },
  {
    id: 'sekaie',
    name: 'せかいえ',
    desc: '熱海に場所を構えるリゾートホテル「せかいえ」のウェブサイトです。',
    note: '',
    href: 'https://www.atamisekaie.jp/',
    anchors: ['', 'top', 'about', 'suggest', 'plan', 'program', 'access', 'news', 'premium'],
  },
  {
    id: 'nintei',
    name: '一般財団法人 家電製品協会 認定センター',
    desc: '家電関連の資格を取得する方に向けてのポータルサイトになります。',
    note: '',
    href: 'https://www.aeha.or.jp/nintei-center/',
    anchors: ['', 'home', 'top-information-list'],
  },
  {
    id: 'mitsubishi_intern',
    name: '三菱電機 インターンシップ情報',
    desc: '三菱電機のインターンシップに関する情報ページです。',
    note: '',
    href: 'https://www.mitsubishielectric.co.jp/saiyo/intern/index.html',
    anchors: [],
  },
  {
    id: 'mitsubishi_intern',
    name: 'Meltopia カスタマーレポート',
    desc: '三菱電機のIT製品・サービス情報などの導入事例を検索するページです。',
    note: '',
    href: 'http://www.mitsubishielectric.co.jp/meltopia/customerreport/',
    anchors: [],
  }
];

export const individual: Work[] = [
  {
    id: 'tatibana',
    name: '旭たちばな幼稚園・保育園',
    desc: '神奈川県で幼稚園・保育園を展開する、学校法人 妙常学園 認定こども園のウェブサイトです。',
    note: '',
    href: [
      {
        url: 'https://tatibana.ed.jp/youtien/',
        txt: '旭たちばな幼稚園'
      },
      {
        url: 'https://tatibana.ed.jp/hoikuen/',
        txt: '旭たちばな保育園'
      }
    ],
    anchors: ['', 'top', 'induction', 'news'],
  },
  {
    id: 'athmen',
    name: 'アスメンプロジェクト',
    desc: 'アスリートをサポートする【アスリート･メンタルサポートプロジェクト】のウェブサイトです。',
    note: '',
    href: 'https://athmen.com/',
    anchors: ['', 'top', 'concept', 'service', 'support'],
  }
]