export default ({ markup, css }) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <title>MERN starter</title>
    </head>
    <body>
      <div id="root">${markup}</div>
      <style id="jss-server-side">${css}</style>
      <script src="/dist/bundle.js"></script>
    </body>
  </html>`
}
