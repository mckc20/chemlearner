import { renderHook } from '@testing-library/react'
import { useCompoundLibrary } from './useCompoundLibrary'

beforeEach(() => {
  localStorage.clear()
})

describe('useCompoundLibrary', () => {
  test('pre-loads 15 default compounds on first run', () => {
    const { result } = renderHook(() => useCompoundLibrary())
    expect(result.current.compounds).toHaveLength(36)
    const names = result.current.compounds.map(c => c.name)
    expect(names).toContain('Water')
    expect(names).toContain('Sulphuric Acid')
    expect(names).toContain('Salt')
    expect(names).toContain('Nitroglycerin')
  })

  test('restores compounds from localStorage on remount', () => {
    const { result, unmount } = renderHook(() => useCompoundLibrary())
    const initialCount = result.current.compounds.length

    unmount()
    const { result: result2 } = renderHook(() => useCompoundLibrary())
    expect(result2.current.compounds).toHaveLength(initialCount)
  })
})
