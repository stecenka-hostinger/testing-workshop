import { createTestingPinia } from '@pinia/testing';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/vue';

import AISearch from '@/AISearch.vue';

jest.mock('vue-router', () => ({
  ...jest.requireActual('vue-router'),
  useRouter: () => ({
    resolve: () => ({
      name: 'path-name',
    }),
  }),
}));
jest.mock('@/composables/useScreen', () => ({
  useScreen: () => ({
    isSmall: false,
  }),
}));
jest.mock('@vueuse/core', () => ({
  ...jest.requireActual('@vueuse/core'),
  useDebounceFn: (callback: Function) => callback,
}));
jest.mock('@/repositories/aiSearchRepo', () => ({
  getAISearch: () => [
    {
      data: {
        documents: [
          {
            score: 1,
            pageContent: 'page content',
            metadata: {
              breadcrumbs: 'breadcumbs',
              subheader: 'this is the result',
              path: '/path',
            },
          },
        ],
      },
    },
  ],
}));

const mockPinia = createTestingPinia({ stubActions: false });

const renderComponent = (pinia = mockPinia) =>
  render(AISearch, {
    global: {
      plugins: [pinia],
    },
  });

describe('AISearch', () => {
  describe('"AI Search trigger" button', () => {
    it('should expand AI search on click', async () => {
      const user = userEvent.setup();
      const { getByRole } = renderComponent();

      const button = getByRole('button');

      await user.click(button);

      const legend = getByRole('group', { name: 'What are you looking for?' });

      expect(legend).toBeVisible();
    });
  });

  it('should display search results on successful search input', async () => {
    const user = userEvent.setup();
    const pinia = createTestingPinia({
      initialState: {
        hpanelControlsStore: {
          isAISearchOpen: true,
        },
      },
    });
    const { getByRole, queryByText, getByText } = renderComponent(pinia);

    expect(queryByText('this is the result')).toBeNull();
    const input = getByRole('textbox');

    await user.type(input, 'abc');

    expect(getByText('this is the result')).toBeVisible();
  });
});
