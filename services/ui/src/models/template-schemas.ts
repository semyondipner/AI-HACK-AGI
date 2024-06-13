import { formatDate } from '@/utils/dates';
import { type FormKitSchemaNode } from '@formkit/core';
import { mdiChartBoxOutline, mdiChartLine, mdiCompare, mdiNewspaper } from '@mdi/js';

export const DEFAULT_SCHEMA = 'DEFAULT';
export const SOURCES_ELEMENT = 'sources';

const schemaSources: FormKitSchemaNode[] = [
  {
    $formkit: 'select',
    name: SOURCES_ELEMENT,
    label: 'Источники',
    options: [],
    help: 'Веб-сайты и другие источники данных',
    multiple: true,
  },
];

const schemaField: FormKitSchemaNode[] = [
  {
    $formkit: 'text',
    name: 'field',
    label: 'Сфера деятельности',
    help: 'Примеры: Металургическая комапания, Нефтедобывающее предприятие',
    value: 'ИТ-компания',
  },
];

const schemaCompany: FormKitSchemaNode[] = [
  { $formkit: 'text', name: 'company', label: 'Компания', value: 'GitHub' },
];

// const dateRange: FormKitSchemaNode[] = [
//   { $formkit: 'date', name: 'date_from', label: 'Дата, от', value: formatDate(new Date()) },
//   { $formkit: 'date', name: 'date_to', label: 'Дата, по', value: formatDate(new Date()) },
// ];

const schemaEmployeeGrade: FormKitSchemaNode[] = [
  {
    $formkit: 'select',
    name: 'employee_grade',
    label: 'Ранг сотрудника',
    options: [
      'Генеральный директор',
      'Экономический директор',
      'Финансовый директор',
      'Начальник отдела маркетинга',
      'Начальник отдела кадров',
      'Начальник отдела информации',
      'Начальник отдела закупок',
    ],
  },
];

export const templateSchemas: Record<string, FormKitSchemaNode[]> = {
  INNOVATION_NEWS: [
    ...schemaSources,
    ...schemaField,
    ...schemaCompany,
    ...schemaEmployeeGrade,
    {
      $formkit: 'select',
      name: 'importance',
      label: 'Важность',
      options: ['Кратко', 'Подробно'],
      help: 'Пояснение важности для области',
      value: 'Кратко',
    },
    {
      $formkit: 'number',
      name: 'news_amount',
      label: 'Количество новостей',
      number: 'integer',
      value: 5,
    },
    { $formkit: 'date', name: 'date', label: 'Новости на дату', value: formatDate(new Date()) },
  ],
  COMPETITOR_REVIEW: [
    ...schemaSources,
    ...schemaField,
    ...schemaCompany,
    ...schemaEmployeeGrade,
    { $formkit: 'date', name: 'date', label: 'Начальная дата', value: formatDate(new Date()) },
    {
      $formkit: 'select',
      name: 'company_location',
      label: 'Расположение компании',
      options: ['Россия', 'Россия, СНГ', 'Зарубежные', 'Pарубежные, Азия'],
      value: 'Россия',
    },
    {
      $formkit: 'text',
      name: 'specific_products',
      label: 'Продукция',
      help: 'Пример: Упаковка, Автомобильные шины, Гвозди',
      value: 'Стальные листы, Рельсы',
    },
    {
      $formkit: 'select',
      name: 'report_length',
      label: 'Подробность отчёта',
      options: ['Краткий', 'Средний', 'Подробный'],
      value: 'Кратко',
    },
    {
      $formkit: 'textarea',
      name: 'competitor_urls',
      label: 'Сайты конкурентов',
      help: 'По одному на каждой строке',
      value: 'https://github.com/\nhttps://google.com/',
    },
  ],
  [DEFAULT_SCHEMA]: [...schemaSources],
};

export const templateIcons: Record<string, string> = {
  [DEFAULT_SCHEMA]: mdiChartBoxOutline,
  INNOVATION_NEWS: mdiNewspaper,
  MARKET_ANALYSIS: mdiChartLine,
  COMPETITOR_REVIEW: mdiCompare,
};
