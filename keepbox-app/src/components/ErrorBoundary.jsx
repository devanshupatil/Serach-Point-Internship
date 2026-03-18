import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">error</span>
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-400 mb-4">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
