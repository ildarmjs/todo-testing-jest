import { render, screen } from '@testing-library/react'
import { App } from 'src/App'
import ue from '@testing-library/user-event'

const userEvent = ue.setup({
	advanceTimers: jest.advanceTimersByTime
})

describe('Список задач', () => {
	it('пустой, и кнопка фильтра отсутствует', async () => {
		render(<App />)

		const filterBtn = screen.queryByTestId('filter-button')
		const items = screen.queryByRole('list')

		expect(items).not.toBeInTheDocument()
		expect(filterBtn).not.toBeInTheDocument()
	})

	it('с включенным фильтром', async () => {
		render(<App />)

		const inputEl = screen.getByRole('textbox')
		const addBtnEl = screen.getByAltText(/Добавить/i)

		await userEvent.clear(inputEl)
		await userEvent.type(inputEl, 'Первый заголовок')
		await userEvent.click(addBtnEl)

		await userEvent.type(inputEl, 'Второй заголовок')
		await userEvent.click(addBtnEl)

		const firstElem = screen.getByRole('checkbox', {
			name: /Первый заголовок/i
		})
		const secondElem = screen.getByRole('checkbox', {
			name: /Второй заголовок/i
		})

		await userEvent.click(firstElem)

		const filterBtn = screen.getByTestId('filter-button')

		await userEvent.click(filterBtn)

		const items = screen.getAllByRole('listitem')

		expect(filterBtn).toHaveClass('active')

		expect(items).toHaveLength(1)

		expect(secondElem).not.toBeInTheDocument()
	})

	it('с выключенным фильтром', async () => {
		render(<App />)

		const filterBtn = screen.getByTestId('filter-button')

		await userEvent.click(filterBtn)

		const items = screen.getAllByRole('listitem')

		expect(filterBtn).not.toHaveClass('active')
		expect(items).toHaveLength(2)
	})
})
