import { Injectable, signal } from '@angular/core';

export interface ArticleTranslation {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
}

export interface Article {
  id: number;
  slug: string;
  date: string;
  readTime: string;
  image: string;
  tag: string; // Key for i18n tag
  translations: {
    en: ArticleTranslation;
    ru: ArticleTranslation;
    ka: ArticleTranslation;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  readonly articles = signal<Article[]>([
    {
      id: 1,
      slug: 'mathematics-of-precision',
      date: 'April 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=80',
      tag: 'ARTICLES.TAGS.ENGINEERING',
      translations: {
        ru: {
          title: 'Математика экономии: Почему лазерный замер — это база',
          excerpt: 'Разбор того, как ошибка в замере на 1 см приводит к инфляции бюджета на 15% и почему лазерное сканирование — единственный способ фиксации цены.',
          date: 'Апрель 2026',
          readTime: '6 мин чтения',
          content: `
            <p>В индустрии ремонта Тбилиси существует опасный миф: "замерим рулеткой, а там подгоним". В FixEntro мы рассматриваем замер не как формальность, а как критический этап финансового планирования. Математика здесь беспощадна.</p>
            <h3>Анатомия ошибки в 1 сантиметр</h3>
            <p>Ошибка в 1 см на погонном метре кажется ничтожной. Однако в масштабах квартиры площадью 100 м² это суммируется в десятки квадратных метров "лишней" штукатурки, плитки и паркета.</p>
            <p>Статистика наших аудитов показывает: ручной замер дает погрешность до 3-5% по площади и до 15% по объему материалов. При базовых ставках <strong>240/400/570 GEL/м²</strong>, такая погрешность может стоить клиенту от 3,000 до 8,000 лари чистого убытка.</p>
            <h3>Технология FixEntro</h3>
            <p>Мы используем лазерное 3D-сканирование пространства перед созданием инженерного проекта. Это позволяет создать точную цифровую копию объекта (BIM-модель) и рассчитать объем материалов с точностью до 0.5%.</p>
          `
        },
        en: {
          title: 'The Mathematics of Savings: Why Laser Measurement is Fundamental',
          excerpt: 'A breakdown of how a 1cm measurement error leads to 15% budget inflation and why laser scanning is the only way to lock the price.',
          date: 'April 2026',
          readTime: '6 min read',
          content: `
            <p>In the Tbilisi renovation industry, there is a dangerous myth: "we\'ll measure with a tape, then adjust." At FixEntro, we view measurement not as a formality, but as a critical stage of financial planning.</p>
            <h3>Anatomy of a 1 Centimeter Error</h3>
            <p>A 1 cm error per linear meter seems negligible. However, in a 100 m² apartment, this adds up to dozens of "extra" square meters of plaster, tile, and parquet.</p>
            <p>Our audit statistics show: manual measurement gives an error of up to 3-5% in area and up to 15% in material volume. With base rates of <strong>240/400/570 GEL/m²</strong>, such an error can cost the client between 3,000 and 8,000 GEL in pure loss.</p>
            <h3>FixEntro Technology</h3>
            <p>We use laser 3D scanning before creating the engineering project. This allows us to create an exact digital twin (BIM model) and calculate material volumes with 0.5% precision.</p>
          `
        },
        ka: {
          title: 'ეკონომიკის მათემატიკა: რატომ არის ლაზერული აზომვა ფუნდამენტური',
          excerpt: 'როგორ იწვევს 1 სმ-იანი შეცდომა ბიუჯეტის 15%-იან ინფლაციას და რატომ არის ლაზერული სკანირება ფასის დაფიქსირების ერთადერთი გზა.',
          date: 'აპრილი 2026',
          readTime: '6 წთ წასაკითხად',
          content: `
            <p>თბილისის სარემონტო ინდუსტრიაში არსებობს საშიში მითი: "გავზომავთ რულეტკით, მერე მოვარგებთ". FixEntro-ში ჩვენ აზომვას განვიხილავთ არა როგორც ფორმალობას, არამედ როგორც ფინანსური დაგეგმარების კრიტიკულ ეტაპს.</p>
            <h3>1 სანტიმეტრიანი შეცდომის ანატომია</h3>
            <p>1 სმ-იანი შეცდომა ერთ გრძივ მეტრზე უმნიშვნელოდ ჩანს. თუმცა, 100 მ² ფართობის ბინაში, ეს ჯამში ათეულობით "ზედმეტი" კვადრატული მეტრი ბათქაში, ფილა და პარკეტია.</p>
            <p>ჩვენი აუდიტის სტატისტიკა აჩვენებს: ხელით აზომვა იძლევა 3-5%-მდე ცდომილებას ფართობში და 15%-მდე მასალების მოცულობაში. <strong>240/400/570 GEL/მ²</strong> საბაზისო განაკვეთების შემთხვევაში, ასეთმა ცდომილებამ შეიძლება კლიენტს 3,000-დან 8,000 ლარამდე ზარალი მოუტანოს.</p>
            <h3>FixEntro-ს ტექნოლოგია</h3>
            <p>ჩვენ ვიყენებთ სივრცის ლაზერულ 3D სკანირებას საინჟინრო პროექტის შექმნამდე. ეს საშუალებას გვაძლევს შევქმნათ ობიექტის ზუსტი ციფრული ასლი (BIM-მოდელი) და გამოვთვალოთ მასალების მოცულობა 0.5%-იანი სიზუსტით.</p>
          `
        }
      }
    },
    {
      id: 2,
      slug: 'tbilisi-logistics',
      date: 'March 2026',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',
      tag: 'ARTICLES.TAGS.LOGISTICS',
      translations: {
        ru: {
          title: 'Тбилисская логистика: Почему район имеет значение',
          excerpt: 'Скрытые расходы Старого Города против новых высоток Сабуртало. Объясняем механику районных коэффициентов.',
          date: 'Март 2026',
          readTime: '7 мин чтения',
          content: `
            <p>Многие клиенты задаются вопросом: "Почему ремонт в Ваке стоит дороже, чем в Глдани, если материалы те же?". Ответ кроется в суровой логистике Тбилиси.</p>
            <h3>Фактор узких улиц</h3>
            <p>В районах вроде Мтацминды логистика превращается в спецоперацию. Узкие улицы делают невозможным проезд 10-тонного грузовика. Это означает перегрузку материалов в малые фургоны и ручной подъем при отсутствии лифтов.</p>
            <h3>Коэффициенты районов</h3>
            <p>Наш калькулятор использует <strong>Районный коэффициент (например, Ваке 1.25x)</strong>. Это отражение реальных затрат на доставку и подъем. В Ваке или Вере стоимость логистики возрастает на 20-30% из-за сложности доступа.</p>
          `
        },
        en: {
          title: 'Tbilisi Logistics: Why District Matters',
          excerpt: 'Hidden costs of the Old City vs. new high-rises in Saburtalo. Explaining the mechanics of district multipliers.',
          date: 'March 2026',
          readTime: '7 min read',
          content: `
            <p>Many clients ask: "Why does renovation in Vake cost more than in Gldani if the materials are the same?" The answer lies in the harsh logistics of Tbilisi.</p>
            <h3>The Narrow Streets Factor</h3>
            <p>In districts like Mtatsminda, logistics turns into a special operation. Narrow streets make it impossible for a 10-ton truck to pass. This means reloading materials into small vans and manual lifting where elevators are absent.</p>
            <h3>District Multipliers</h3>
            <p>Our calculator uses a <strong>District Multiplier (e.g., Vake 1.25x)</strong>. This reflects real costs for delivery and lifting. In Vake or Vera, logistics costs increase by 20-30% due to access difficulty.</p>
          `
        },
        ka: {
          title: 'თბილისის ლოგისტიკა: რატომ აქვს უბანს მნიშვნელობა',
          excerpt: 'ძველი ქალაქის ფარული ხარჯები საბურთალოს ახალი მაღალსართულიანი კორპუსების წინააღმდეგ. რაიონული კოეფიციენტების მექანიკის განმარტება.',
          date: 'მარტი 2026',
          readTime: '7 წთ წასაკითხად',
          content: `
            <p>ბევრი კლიენტი კითხულობს: "რატომ ღირს რემონტი ვაკეში უფრო ძვირი, ვიდრე გლდანში, თუ მასალები იგივეა?" პასუხი თბილისის მკაცრ ლოგისტიკაში მდგომარეობს.</p>
            <h3>ვიწრო ქუჩების ფაქტორი</h3>
            <p>ისეთ უბნებში, როგორიცაა მთაწმინდა, ლოგისტიკა სპეცოპერაციად იქცევა. ვიწრო ქუჩები შეუძლებელს ხდის 10-ტონიანი სატვირთოს გავლას. ეს ნიშნავს მასალების მცირე ფურგონებში გადატვირთვას და ხელით ატანას ლიფტების არარსებობისას.</p>
            <h3>უბნის კოეფიციენტები</h3>
            <p>ჩვენი კალკულატორი იყენებს <strong>უბნის კოეფიციენტს (მაგალითად, ვაკე 1.25x)</strong>. ეს ასახავს მიწოდებისა და ატანის რეალურ ხარჯებს. ვაკეში ან ვერაზე ლოგისტიკის ხარჯები 20-30%-ით იზრდება მისადგომობის სირთულის გამო.</p>
          `
        }
      }
    },
    {
      id: 3,
      slug: 'old-fund-renovation',
      date: 'February 2026',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      tag: 'ARTICLES.TAGS.ARCHITECTURE',
      translations: {
        ru: {
          title: 'Реновация Старого Фонда: Как не похоронить бюджет',
          excerpt: 'Глубокое погружение в структурный аудит "сталинок" и домов в историческом центре.',
          date: 'Февраль 2026',
          readTime: '9 мин чтения',
          content: `
            <p>Покупка квартиры в "сталинке" или историческом доме — это мечта об эстетике, которая может стать инженерным кошмаром. Реновация старого фонда требует радикально иного подхода.</p>
            <h3>Скрытые угрозы</h3>
            <p>Главная проблема старых домов — износ скрытых коммуникаций и перекрытий. Деревянные балки, прогнившие стояки — это реальность. Попытка сделать "косметику" без структурного аудита — это выброшенные деньги.</p>
            <h3>Инженерная стратегия</h3>
            <p>Для объектов старого фонда мы применяем обязательный <strong>Технический Аудит (Structural Audit Fee 15%)</strong>. Наша задача — создать современную инженерную капсулу внутри исторического здания.</p>
          `
        },
        en: {
          title: 'Old Fund Renovation: How Not to Bury Your Budget',
          excerpt: 'A deep dive into structural auditing of "Stalinkas" and houses in the historic center.',
          date: 'February 2026',
          readTime: '9 min read',
          content: `
            <p>Buying an apartment in a "Stalinka" or a historic house is a dream of aesthetics that can become an engineering nightmare. Old fund renovation requires a radically different approach.</p>
            <h3>Hidden Threats</h3>
            <p>The main problem with old houses is the wear of hidden utilities and ceilings. Wooden beams, rotten risers — this is reality. Attempting a "cosmetic" fix without a structural audit is money down the drain.</p>
            <h3>Engineering Strategy</h3>
            <p>For old fund objects, we apply a mandatory <strong>Technical Audit (Structural Audit Fee 15%)</strong>. Our goal is to create a modern engineering capsule inside the historic building.</p>
          `
        },
        ka: {
          title: 'ძველი ფონდის რემონტი: როგორ არ დავმარხოთ ბიუჯეტი',
          excerpt: 'სტრუქტურული აუდიტის სიღრმისეული ანალიზი "სტალინკებსა" და ისტორიულ ცენტრში მდებარე სახლებში.',
          date: 'თებერვალი 2026',
          readTime: '9 წთ წასაკითხად',
          content: `
            <p>ბინის ყიდვა "სტალინკაში" ან ისტორიულ სახლში ესთეტიკაზე ოცნებაა, რომელიც შეიძლება საინჟინრო კოშმარად იქცეს. ძველი ფონდის რემონტი რადიკალურად განსხვავებულ მიდგომას მოითხოვს.</p>
            <h3>ფარული საფრთხეები</h3>
            <p>ძველი სახლების მთავარი პრობლემა ფარული კომუნიკაციებისა და გადახურვების ცვეთაა. ხის კოჭები, დამპალი დგარები — ეს რეალობაა. "კოსმეტიკური" რემონტის მცდელობა სტრუქტურული აუდიტის გარეშე გადაყრილი ფულია.</p>
            <h3>საინჟინრო სტრატეგია</h3>
            <p>ძველი ფონდის ობიექტებისთვის ჩვენ ვიყენებთ სავალდებულო <strong>ტექნიკურ აუდიტს (Structural Audit Fee 15%)</strong>. ჩვენი ამოცანაა ისტორიული შენობის შიგნით თანამედროვე საინჟინრო კაფსულა შევქმნათ.</p>
          `
        }
      }
    }
  ]);
}
