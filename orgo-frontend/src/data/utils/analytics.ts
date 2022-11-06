import Router from 'next/router'
import ReactGA from 'react-ga'

export enum EventCategory {
  MAP = 'Map',
  TASK = 'Task',
  SUBMISSION = 'Submission',
  EVIDENCE = 'Evidence',
  PROFILE = 'Profile',
  NOTIFICATION = 'Notification',
}

export const initGA = (UA) => {
  if (UA && typeof window !== 'undefined') {
    ReactGA.initialize(UA, { debug: !process.env.production })
    logPageViews()
  }
}

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = '', action = '', label = '') => {
  if (category && action) {
    ReactGA.event({ category, action, label })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}

export function logPageViews() {
  logPageView()
  Router.events.on('routeChangeComplete', () => {
    logPageView()
  })
}
