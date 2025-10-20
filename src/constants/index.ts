export const API_VERSION = 'v1';
export const API_BASE_URL = `/api/${API_VERSION}`;
export const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.API_URL
    : `http://localhost:${process.env.PORT || 8888}`;

export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;

export const DEFAULT_SORT_BY = 'createdAt';
export const DEFAULT_SORT_ORDER = 'desc';

export const DEFAULT_SEARCH = '';
