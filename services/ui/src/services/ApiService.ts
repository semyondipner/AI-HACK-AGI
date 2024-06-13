import { injectable, inject } from 'inversify';
import { AppConfig } from './AppConfig';
import {
  type Email,
  type Report,
  type ReportSource,
  type ReportTemplate,
  type ReportTopic,
} from '@/models/entities';

export interface ApiConfig {
  dummyApi: boolean;
  openAiKey: string;
  tavilyApiKey: string;
}

export interface CrudLoadOpts {
  page?: number;
  perPage?: number;
  sorting?: { key: string; reverse: boolean }[];
  searchQuery?: string;
}

export interface CrudApiProvider<T> {
  keyProp: keyof T;
  create: (item: T) => Promise<void>;
  update: (item: T) => Promise<void>;
  read: (opts: CrudLoadOpts) => Promise<{ items: T[]; total: number }>;
  delete: (item: T) => Promise<void>;
}

type FetchOpts<R> = {
  data?: R;
  query?: { [k: string]: string };
  fetchTotal?: (total: number) => void;
};

const parameterSerde = {
  deser: (parameters: string): any => (parameters ? JSON.parse(parameters) : {}),
  ser: (parameters: any): string => JSON.stringify(parameters || {}),
};

@injectable()
export class ApiService {
  public constructor(@inject(AppConfig) private appConfig: AppConfig) {}

  private async fetch<T, R>(
    method: string,
    endpoint: string,
    { data, query, fetchTotal }: FetchOpts<R> = {},
  ) {
    if (query) {
      endpoint += '?' + new URLSearchParams(query).toString();
    }
    const request: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      request.body = JSON.stringify(data);
    }
    const url = this.appConfig.getApiBaseUrl() + '/' + endpoint;

    const res = await fetch(url, request);
    if (res.status < 200 || 299 < res.status) {
      alert(`API error ${res.status}`);
      return null as never;
    }
    try {
      if (fetchTotal) {
        fetchTotal(Number(res.headers.get('X-Total') || 0));
      }
      return await res.json();
    } catch (e) {
      alert(`Response parse error ${res.status}`);
      return null as never;
    }
  }

  public async getApiConfig() {
    return this.fetch('GET', 'v1/app/config');
  }

  public async setApiConfig(config: ApiConfig) {
    return this.fetch('PUT', 'v1/app/config', { data: config });
  }

  private makeCrudApiProvider<T extends { id: number }>({
    endpoint,
    parser,
    serializer,
  }: {
    endpoint: string;
    parser?: (items: T[]) => T[];
    serializer?: (item: T) => T;
  }): CrudApiProvider<T> {
    const keyProp = 'id';
    const fetch = <R>(method: string, ep: string, opts: FetchOpts<R> = {}) =>
      this.fetch(method, ep, opts);
    return {
      keyProp,
      async read({ page, perPage, sorting, searchQuery }: CrudLoadOpts) {
        let total = 0;
        const query: Record<string, string> = {};
        if (page) {
          query['page'] = String(page);
        }
        if (perPage) {
          query['perPage'] = String(perPage);
        }
        if (sorting) {
          query['sorting'] = sorting
            .map(({ key, reverse }) => `${key}:${reverse ? 'desc' : 'asc'}`)
            .join(';');
        }
        if (searchQuery) {
          query['search'] = String(searchQuery);
        }
        const items = await fetch('GET', endpoint, {
          fetchTotal: (_total) => (total = _total),
          query,
        });
        return { items: parser ? parser(items) : items, total };
      },
      async create(item: T) {
        if (serializer) {
          item = serializer(item);
        }
        await fetch('POST', endpoint, { data: item });
      },
      async delete(item: T) {
        await fetch('DELETE', endpoint + '/' + item.id);
      },
      async update(item: T) {
        if (serializer) {
          item = serializer(item);
        }
        await fetch('PATCH', endpoint + '/' + item.id, { data: item });
      },
    };
  }

  public async getTemplateParams() {
    return [
      { id: 1, title: 'Объем рыночной ниши' },
      { id: 2, title: 'Перечень ключевых игроков' },
      { id: 3, title: 'Перечень ключевых потребителей' },
      { id: 4, title: 'Перечень ключевых продуктов' },
      { id: 5, title: 'Сравнительный анализ продуктов' },
    ];
  }

  public getReport(id: number, query: { withDocuments: boolean }) {
    return this.fetch('GET', `v1/report/${id}`, {
      query: {
        withDocuments: query.withDocuments ? '1' : '',
      },
    });
  }

  public generateReport(id: number) {
    return this.fetch('POST', `v1/report/${id}/generate`);
  }

  public getReportsCrud() {
    return this.makeCrudApiProvider<Report>({
      parser: (items) => {
        return items.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          parameters: parameterSerde.deser(item.parameters),
        }));
      },
      serializer: (item) => ({ ...item, parameters: parameterSerde.ser(item.parameters) }),
      endpoint: 'v1/generic/report',
    });
  }

  public getEmailsCrud() {
    return this.makeCrudApiProvider<Email>({
      parser: (items) => {
        return items.map((item) => ({
          ...item,
        }));
      },
      serializer: (item) => ({ ...item }),
      endpoint: 'v1/generic/emails',
    });
  }

  public getReportTopicsCrud() {
    return this.makeCrudApiProvider<ReportTopic>({
      endpoint: 'v1/generic/report-topic',
    });
  }

  public getReportTemplatesCrud() {
    return this.makeCrudApiProvider<ReportTemplate>({
      parser: (items) => {
        return items.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          parameters: parameterSerde.deser(item.parameters),
        }));
      },
      serializer: (item) => ({ ...item, parameters: parameterSerde.ser(item.parameters) }),
      endpoint: 'v1/generic/report-template',
    });
  }

  public getSourcesCrud() {
    return this.makeCrudApiProvider<ReportSource>({
      endpoint: 'v1/generic/report-source',
    });
  }

  // private makeMockCrudApiProvider<T>({
  //   onCreate,
  //   onSearch,
  //   db,
  //   defaultItem,
  //   keyProp,
  // }: {
  //   onCreate?: (item: T) => T;
  //   onSearch: (item: T, search: string) => boolean;
  //   db: T[];
  //   defaultItem: T;
  //   keyProp: keyof T;
  // }): CrudApiProvider<T> {
  //   return {
  //     keyProp,
  //     defaultItem,
  //     async read({ page, perPage, sorting, searchQuery }: CrudLoadOpts) {
  //       await sleep(500);
  //       let items: T[];
  //       if (searchQuery) {
  //         items = db.slice().filter((item) => onSearch(item, searchQuery));
  //       } else {
  //         items = db;
  //       }
  //       if (sorting.length) {
  //         items.sort(sortBy(sorting[0].key));
  //         if (sorting[0].reverse) {
  //           items = items.reverse();
  //         }
  //       }

  //       const start = (page - 1) * perPage;
  //       const end = start + perPage;

  //       return { items: items.slice(start, end), total: items.length };
  //     },

  //     async create(item: T) {
  //       await sleep(500);
  //       if (onCreate) {
  //         item = onCreate(item);
  //       }
  //       db.push(item);
  //     },

  //     async delete(item: T) {
  //       await sleep(500);
  //       remove(db, keyProp, item[keyProp]);
  //     },

  //     async update(item: T) {
  //       await sleep(500);
  //       replace(db, keyProp, item);
  //     },
  //   };
  // }
}
