var express = require('express');
// import 'axios' module
const axios = require('axios');
// Encoding QueryString 
const qs = require('querystring');
// File Stream
var fs = require('fs');
// Nodejs Dom Service
const cheerio = require('cheerio');
// Convert to Image to Text
var Tesseract = require('tesseract.js')

var app = express();
var client_id = '{YOUR_CLIENT_ID}';
var client_secret = '{YOUR_SECRET_KEY}';

var arvgStr = process.argv[2];
var convStr;

var ttsUrl = 'https://openapi.naver.com/v1/voice/tts.bin';

console.log('::: My OCR Reader Service App is started!');
console.log('');

// Tessertact 라이브러리를 활용하여 Image to Text 수행 
Tesseract.recognize(arvgStr)
  .progress(function  (p) { console.log('progress', p)  })
  .catch(err => console.error(err))
  .then(function (result) {

    // Tessertact 라이브러리를 통한 Text 추출 
    console.log('');
    console.log('================= Convert File =====================');
    console.log('::: File Name : ' + arvgStr);
    console.log('====================================================');
    console.log('');
    console.log('================= Convert Text =====================');
    convStr = result.text;
    console.log(result.text)
    console.log('====================================================');

    // 추출된 텍스트를 파일로 저장 
    fs.writeFileSync('./text_contents/'+arvgStr+'.txt', convStr);

    // Clova CSS API
    var request = require('request');
    var options = {
        url: ttsUrl,
        form: {'speaker':'mijin', 'speed':'2', 'text':convStr},
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };

    // Clova CSS를 활용하여 텍스트 파일을 읽어서 mp3 파일을 생성합니다.
    var writeStream = fs.createWriteStream('./voice_contents/'+arvgStr+'.mp3');
    var _req = request.post(options).on('response', function(response) {
      console.log('');
      console.log('============= Clova CSS Response =================');
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type'])
      console.log('==================================================');
    });

    // close mp3 file stream 
    _req.pipe(writeStream); 

    //process.exit(0);

  });
