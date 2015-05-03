import ApplicationView from './ApplicationView'

stylify({
  'body': {
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '100%/1.4',
    margin: 0,
    padding: 0,
  },
  'h1, h2, h3, h4, h5, h6': {
    fontWeight: 'normal',
  },
})

;(function main() {
  var root = document.getElementById('root')
  var app = Application.empty()
  var urlData = url.parse(window.location.href, true)
  if (Boolean(Number(urlData.query.demo))) {
    app = exampleApp()
  }
  React.render(<ApplicationView initialApplication={app} />, root)
})()
