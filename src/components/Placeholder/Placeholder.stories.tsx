import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Placeholder from './Placeholder';

const meta = {
  component: Placeholder,
} satisfies Meta<typeof Placeholder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithText: Story = {
  args: { text: 'Storybook 동작 확인용' },
};
