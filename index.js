var createScreen = require('./screen.js')
var request = require('request')
var ldj = require('ldjson-stream')
var through = require('through2')

module.exports = function(theme) {
  var screen = createScreen(theme)
  var httpRead = screen.createChart({
    height: "48%",
    width: "50%",
    title: "HTTP Read"
  })
  var httpWritten = screen.createChart({
    height: "49%",
    width: "50%",
    top: '52%',
    title: "HTTP Written"
  })
  var levelRead = screen.createChart({
    height: "48%",
    left: "51%",
    width: '49%',
    title: "Level Read"
  })
  var levelWritten = screen.createChart({
    height: "49%",
    width: '49%',
    left: '51%',
    top: '52%',
    title: "Level Written"
  })
  var req = request('http://localhost:6461/api/stats')
  var parser = ldj.parse()
  var filter = through.obj(function(obj, enc, next) {
    httpWritten.write(obj.http.written)
    httpRead.write(obj.http.read)
    levelWritten.write(obj.level.written)
    levelRead.write(obj.level.read)
    next()
  })
  req.pipe(parser).pipe(filter)
}
