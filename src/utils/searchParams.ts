export interface SearchValues {
  keyword: string;
  serviceType: string | null;
  category: string | null;
  region: string | null;
}

export function buildSearchParams(values: SearchValues): URLSearchParams {
  const params = new URLSearchParams();
  if (values.keyword) params.set('keyword', values.keyword);
  if (values.serviceType) params.set('serviceType', values.serviceType);
  if (values.category) params.set('category', values.category);
  if (values.region) params.set('region', values.region);
  return params;
}

export function parseSearchParams(params: URLSearchParams): SearchValues {
  return {
    keyword: params.get('keyword') ?? '',
    serviceType: params.get('serviceType'),
    category: params.get('category'),
    region: params.get('region')
  };
}
