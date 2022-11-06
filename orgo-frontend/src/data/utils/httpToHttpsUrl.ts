const httpToHttpsUrl = (url = ''): string => {
  if (!url) {
    return ''
  }

  if (url.startsWith('https')) {
    return url
  } else {
    return 'https' + url.slice(4)
  }
}

export default httpToHttpsUrl
