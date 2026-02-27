import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/examples', () => {
    return HttpResponse.json([
      { id: 1, title: 'Example 1', status: 'published' },
      { id: 2, title: 'Example 2', status: 'draft' },
    ]);
  }),
];
