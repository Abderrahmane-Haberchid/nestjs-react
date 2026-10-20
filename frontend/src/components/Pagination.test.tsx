import { fireEvent, render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('disables previous on the first page and emits the next page', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={1} totalPages={3} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole('button', { name: /Précédent/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /Suivant/ }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('does not render navigation for a single page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onPageChange={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('disables next on the last page and never changes page when disabled', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={3} totalPages={3} onPageChange={onPageChange} />,
    );
    const nextButton = screen.getByRole('button', { name: /Suivant/ });

    expect(nextButton).toBeDisabled();
    fireEvent.click(nextButton);
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
