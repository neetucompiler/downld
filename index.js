var accessToken = '11254283322a4839a94387093a955cf0'
var baseUrl = 'https://api.api.ai/v1/'
var $messages = $('.messages-content')
var $userInputField = $('#userInputText')
var botMsgCounter = 0
var chartContainer = 0
var highChartsContainerID = []
var feedBack = {
  logs: []
}
var chart
var d
var recognizing = false
var speechTextToggle = false
var refreshCheck = false

var customTags = [':|', '|:'];
Mustache.tags = customTags;

Highcharts.theme = {
  lang: {
    drillUpText: '< Back'
  },
  colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
  chart: {
    backgroundColor: {
      linearGradient: {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1
      },
      stops: [
        [0, '#2a2a2b'],
        [1, '#3e3e40']
      ]
    },
    style: {
      fontFamily: '\'Unica One\', sans-serif'
    },
    plotBorderColor: '#606063'
  },
  title: {
    style: {
      color: '#E0E0E3',
      textTransform: 'uppercase',
      fontSize: '20px'
    }
  },
  subtitle: {
    style: {
      color: '#E0E0E3',
      textTransform: 'uppercase'
    }
  },
  xAxis: {
    gridLineColor: '#707073',
    labels: {
      style: {
        color: '#E0E0E3'
      }
    },
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073',
    title: {
      style: {
        color: '#A0A0A3'
      }
    }
  },
  yAxis: {
    gridLineColor: '#707073',
    labels: {
      style: {
        color: '#E0E0E3'
      }
    },
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073',
    tickWidth: 1,
    title: {
      style: {
        color: '#A0A0A3'
      }
    }
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    style: {
      color: '#F0F0F0'
    }
  },
  plotOptions: {
    series: {
      dataLabels: {
        color: '#fff'
      },
      marker: {
        lineColor: '#333'
      }
    },
    boxplot: {
      fillColor: '#505053'
    },
    candlestick: {
      lineColor: 'white'
    },
    errorbar: {
      color: 'white'
    }
  },
  legend: {
    itemStyle: {
      color: '#E0E0E3'
    },
    itemHoverStyle: {
      color: '#FFF'
    },
    itemHiddenStyle: {
      color: '#606063'
    }
  },
  credits: {
    style: {
      color: '#666'
    }
  },
  labels: {
    style: {
      color: '#707073'
    }
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: '#F0F0F3'
    },
    activeDataLabelStyle: {
      color: '#F0F0F3'
    }
  },
  navigation: {
    buttonOptions: {
      symbolStroke: '#DDDDDD',
      theme: {
        fill: '#505053'
      }
    }
  },
  // scroll charts
  rangeSelector: {
    buttonTheme: {
      fill: '#505053',
      stroke: '#000000',
      style: {
        color: '#CCC'
      },
      states: {
        hover: {
          fill: '#707073',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        },
        select: {
          fill: '#000003',
          stroke: '#000000',
          style: {
            color: 'white'
          }
        }
      }
    },
    inputBoxBorderColor: '#505053',
    inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
    },
    labelStyle: {
      color: 'silver'
    }
  },
  navigator: {
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(255,255,255,0.1)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
    },
    xAxis: {
      gridLineColor: '#505053'
    }
  },
  scrollbar: {
    barBackgroundColor: '#808083',
    barBorderColor: '#808083',
    buttonArrowColor: '#CCC',
    buttonBackgroundColor: '#606063',
    buttonBorderColor: '#606063',
    rifleColor: '#FFF',
    trackBackgroundColor: '#404043',
    trackBorderColor: '#404043'
  },
  // special colors for some of the
  legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
  background2: '#505053',
  dataLabelsColor: '#B0B0B3',
  textColor: '#C0C0C0',
  contrastTextColor: '#F0F0F3',
  maskColor: 'rgba(255,255,255,0.3)'
}

// Apply the theme
Highcharts.setOptions(Highcharts.theme)

function renderHighChart(elementId, chartingData) {
  return Highcharts.chart(elementId, chartingData)
}
function PostMessage (text) {
  // var text = 'i want flight from chennai to mumbai'
  $.ajax({
    url: baseUrl + 'query',
    dataType: 'json',
    type: 'post',
    contentType: 'application/json; charset=utf-8',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    data: JSON.stringify({
      query: text,
      lang: 'en',
      sessionId: 'yaydevdiner'
    }),
    success: function (data, status) {
      console.log(data)
      setTimeout(function () {
        GetMessage(data)
      }, 2000)
    }
  })
}
function GetMessage (data) {
  var luisResponse = data['result']['speech']
  console.log('API.ai response :' + data['result']['speech'])
  var botJsonMsg = {
    'message': luisResponse,
    'type': 'normal'
  }
  if (luisResponse.length > 0) {
    botMessage(botJsonMsg)
    console.log(botJsonMsg)
  } else if (luisResponse.length === 0) {
      console.log("failure")
    }
}
function disableUserInput(placeholderText) {
  $userInputField.blur() // Remove the focus from the user input field
  $userInputField.val('') // Remove the text from the user input field
  $userInputField.attr('disabled', 'true') // Disable the user input field
  $userInputField.attr('placeholder', placeholderText || 'Please Wait...') // Change the placeholder to ask the user to wait
  $('.message-box').addClass('disabledCursor')
  $('.message-submit').attr('disabled', 'true')
  $('#enabledVoiceBtn').css('display', 'none')
  $('#disabledVoiceBtn').css('display', 'block')
  $('#generalForm').css('cursor', 'not-allowed')
}

function enableUserInput(placeholderText) {
  $userInputField.focus() // Remove the focus from the user input field
  $userInputField.removeAttr('disabled') // Enable the user input field
  $userInputField.attr('placeholder', placeholderText || 'Please Type!') // Change the placeholder to prompt input from the user
  $('.message-box').removeClass('disabledCursor')
  $('.message-submit').removeAttr('disabled')
  $('#enabledVoiceBtn').css('display', 'block')
  $('#disabledVoiceBtn').css('display', 'none')
  $('#generalForm').removeAttr('style')
}

$(window).on('load', function() {
  $messages.mCustomScrollbar()
})

$('.end-chat').click(function() {
  botMessage({
    message: 'Please provide us a feedback',
    type: 'feedback'
  })
  $('.feedback-bar').hide()
  disableUserInput('Thank you for using our services')
})

function updateScrollbar() {
  $messages.mCustomScrollbar('update').mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  })
}

function formatAMPM(date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  var hour = hours % 12
  hours = hours ? hour : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

function setDate(t) {
  d = new Date()
  $(t).find('.message').append($('<div class="timestamp">' + formatAMPM(d) + '</div>'))
}

function setTyping() {
  $('<div class="timestamp">Typing...</div>').appendTo($('.message:last'))
}

/**
 * Insert user input message
 * @param {any} msg User's input text
 * @returns false if user message is null
 */
function insertMessage(msg) {
  if ($.trim(msg) === '') {
    return false
  }
  var temp = $('<div class="message message-personal">' + msg + '</div>')
  temp.appendTo($('.mCSB_container')).addClass('new')
  setDate(temp)
  $('.message-input').val(null)
  updateScrollbar()
}

function checkNested(obj /*, level1, level2, ... levelN */ ) {
  var args = Array.prototype.slice.call(arguments, 1)

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false
    }
    obj = obj[args[i]]
  }
  return true
}

/**
 * Create a new utterance for the specified text and add it to
 * the queue.
 * @param {any} response message from bot
 */
function speak(text) {
  var msg = new SpeechSynthesisUtterance()
  msg.text = text
  speechSynthesis.speak(msg)
}

/**
 * Insert bot message
 * @param {any} botmsg the bot message
 * @param {any} type type of message
 * @param {any} data the data/url required for the type of message
 * @returns false if no message is passed
 */
function botMessage(botMsg) {
  if (!botMsg) return false
  highChartsContainerID = []
  $('.message.loading').remove()
  $('.message.timestamp').remove()
  var temp = ''
  var rendered
  if (botMsg.type === 'feedback') {
    temp = $('#feedbackTemplate').clone()
  } else if (botMsg.type === 'normal' || !(botMsg.type)) {
    temp = $('#normalMessage').clone().html()
    Mustache.parse(temp)
    rendered = Mustache.render(temp, {
      message: botMsg.message
    })
    temp = $(rendered)
  } else if (botMsg.type === 'video') {
    temp = $('#videoTemplate').clone().html()
    Mustache.parse(temp)
    rendered = Mustache.render(temp, {
      attr: 'src',
      attrVal: botMsg.data
    })
    temp = $(rendered)
  } else if (botMsg.type === 'audio') {
    temp = $('#audioTemplate').clone().html()
    Mustache.parse(temp)
    rendered = Mustache.render(temp, {
      attr: 'src',
      attrVal: botMsg.data
    })
    temp = $(rendered)
  } else if (botMsg.type === 'herocard') {
    // console.log(displayCard(botMsg.data))
    temp = $(displayCard(botMsg.data).wrap('<p/>').parent())
  } else if (botMsg.type === 'choices') {
    var chtemp = $('#choicesMessage').clone().html()
    Mustache.parse(temp)
    rendered = Mustache.render(chtemp, {
      message: botMsg.message,
      choices: faqs(botMsg.data)
    })
    temp = $(rendered)
  } else if (botMsg.type === 'highChart') {
    temp = $('#highChartTemplate').clone().html()
    Mustache.parse(temp)
    var tempID = 'chartContainer' + (chartContainer++)
    highChartsContainerID.push(tempID)
    rendered = Mustache.render(temp, {
      chartContainer: tempID,
      highChart: function() {
        return function(text, render) {
          return render(text)
        }
      }
    })
    temp = $(rendered)
  } else if (botMsg.type === 'value') {
    temp = $('#statMessage').clone().html()
    console.log(botMsg.comparer.positive)
    console.log(botMsg.comparer.compareText)
    console.log(botMsg.comparer.compareValue)
    console.log("hi")
    rendered = Mustache.render(temp, {
      message: botMsg.message,
      actualValue: botMsg.achieved.actualValue,
      targetValue: botMsg.achieved.targetValue,
      positive: botMsg.comparer.positive,
      compareText: botMsg.comparer.compareText,
      compareValue: botMsg.comparer.compareValue
    })
    temp = $(rendered)
  }

  setDate(temp)
  var id = botMsgCounterId()
  $('.mCSB_container').append($(temp.html()).attr('id', id))
  if (botMsg.type === 'herocard') {
    // console.log($('#'+id).find('.rslides').html() + '\n\n\n ---------------------------------------------- \n\n\n')
    $('#' + id).find('.rslides').responsiveSlides({
      auto: false,
      nav: true,
      prevText: '<i class="fa fa-arrow-left fa-2x" aria-hidden="true"></i>',
      nextText: '<i class="fa fa-arrow-right fa-2x" aria-hidden="true"></i>',
      pager: true
    })
  }
  if (botMsg.type === 'highChart') {
    chart = renderHighChart(highChartsContainerID.shift(), regionalMonth)
    chart.setSize(320)
  }
  if (botMsg.type === 'herocard') {
    for (var i = 0; i < botMsg['data']['carousel']['container'].length; i++) {
      var card = botMsg['data']['carousel']['container'][i]
      if (card.hasOwnProperty('highChart')) {
        chart = renderHighChart(highChartsContainerID.shift(), card['highChart'])
      }
    }
  }
  updateScrollbar()
  playSound('bing')
}

/**
 * Plays a soundfile
 * @param {any} filename source and name of the file
 */
function playSound(filename) {
  document.getElementById('sound').innerHTML = '<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename + '.mp3" /></audio>'
}

function displayCard(cards) {
  var $parentCard = $('#parentCard').clone().html()
  $parentCard = $($parentCard)
  // ul encapsulation starts here
  var $parentList = $('<ul class="rslides"></ul>')
  for (var i = 0; i < cards.carousel.container.length; i++) {
    // li encapsulation for each iteration
    var $listTemp = $('<li></li>')
    for (var key in cards.carousel.container[i]) {
      // entire loop must be encapsulated in one li
      switch (key) {
        case 'title':
          $listTemp.append(displayTitle(cards.carousel.container[i][key]))
          break
        case 'image':
          $listTemp.append(displayImage(cards.carousel.container[i][key]))
          break
        case 'audio':
          $listTemp.append(displayAudio(cards.carousel.container[i][key]))
          break
        case 'video':
          $listTemp.append(displayVideo(cards.carousel.container[i][key]))
          break
        case 'buttons':
          $listTemp.append(displayButtons(cards.carousel.container[i][key]))
          break
        case 'highChart':
          $listTemp.append(displayHighChart(cards.carousel.container[i][key]))
          break
        default:
          $listTemp.append(displayDefault())
      }
    }
    $parentList.append($listTemp)
  }
  // console.log($parentList.html())
  $parentCard.append($parentList)

  return $parentCard
}

function botMsgCounterId() {
  return 'botMsg' + (botMsgCounter++)
}

function displayDefault() {
  var $default = $('<h3>Nothing to display</h3>')
  return $default
}

function displayTitle(title) {
  var titletemp = $('.titleCard').clone().html()
  var rendered = Mustache.render(titletemp, {
    titlemsg: title
  })
  return $(rendered).html()
}

function displayImage(image) {
  var imgtemp = $('#imageCard').clone().html()
  return renderAudioVideoImage(imgtemp, image)
}

function displayAudio(audio) {
  var audiotemp = $('#audioCard').clone().html()
  return renderAudioVideoImage(audiotemp, audio)
}

function displayVideo(video) {
  var videotemp = $('#videoCard').clone().html()
  return renderAudioVideoImage(videotemp, video)
}

function displayButtons(buttons) {
  var btntemp = $('#buttonCard').clone().html()
  Mustache.parse(btntemp)
  var rendered = Mustache.render(btntemp, {
    button: buttons
  })
  return rendered
}

function displayHighChart(highChart) {
  // console.log(highChart)
  var highChartTemp = $('#highChartCard').clone().html()
  Mustache.parse(highChartTemp)
  var tempID = 'chartContainer' + (chartContainer++)
  highChartsContainerID.push(tempID)
  var rendered = Mustache.render(highChartTemp, {
    chartContainer: tempID,
    highChart: function() {
      return function(text, render) {
        return render(text)
      }
    }
  })
  return rendered
}

function renderAudioVideoImage(doc, url) {
  var rendered = Mustache.render(doc, {
    attr: 'src',
    attrVal: url
  })
  return $(rendered).html()
}

function registerFeedback(feedback, status, text, shoutout) {
  var check = checkFeedback(feedback, text)
  if (check < 0) {
    addToFeedback(feedBack, status, text)
  } else {
    modifyFeedback(feedBack, check, status, shoutout)
  }
}

function checkFeedback(feedback, text) {
  var index = -1
  if (feedback.logs.length < 1) {
    return -1
  }
  for (var i = 0; i < feedback.logs.length; i++) {
    if (feedback.logs[i].text === text) {
      index = i
    }
  }
  return index
}

function modifyFeedback(feedback, index, status, message) {
  feedback.logs[index].status = status
  if (message) {
    feedback.logs[index].feedback = message
  } else {
    feedback.logs[index].feedback = 'NA'
  }
}

/**
 * Pushes to feedBack Object
 * @param {any} feedback the feedback from the user
 * @param {any} stat status of the feedback eg:Ok/Not Ok
 * @param {any} mtext bot text for which feedback has been given
 */
function addToFeedback(feedback, stat, mtext) {
  feedback.logs.push({
    status: stat,
    text: mtext
  })
}

var setTimeoutID
$('#minim-chat').click(function() {
  $('#minim-chat').css('display', 'none')
  $('#maxi-chat').css('display', 'block')
  // var height = ($(".chat").outerHeight(true) - 46) * -1;
  // $(".chat").css("margin", "0 0 " + height + "px 0");
  $('.chat').css('margin', '0 0 -444px 0')
  setTimeoutID = setTimeout(function() {
    $('.helpTextPopOver').css('display', 'block')
  }, 1500)
})
$('#maxi-chat').click(function() {
  $('#minim-chat').css('display', 'block')
  $('#maxi-chat').css('display', 'none')
  $('.chat').css('margin', '0')
  $('.helpTextPopOver').css('display', 'none')
  clearTimeout(setTimeoutID)
})

$(document).ready(function() {
  // check that your browser supports the API
  if (!(('webkitSpeechRecognition' || 'SpeechRecognition' || 'mozSpeechRecognition' || 'msSpeechRecognition') in window)) {
    console.log('Sorry, your Browser does not support the Speech API')
    $('#userInputVoice').css('display', 'none')
  } else {
    // Create the recognition object and define the event handlers
    var recognizing = false
    var finalTranscript = ''
    var recognition = new(window.webkitSpeechRecognition || window.SpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
    recognition.interimResults = true // show interim results
    recognition.lang = 'en-US' // specify the language
		recognition.maxAlternatives = 5
		
    recognition.onstart = function() {
			recognizing = true
			$userInputField.attr('placeholder', 'Speak slowly and clearly')
			$('#enabledVoiceBtn').css('display', 'none')
			$('#disabledVoiceBtn').css('display', 'block')
      console.log('Speak slowly and clearly')
		}
		
    recognition.onend = function() {
      console.log('speech ended')
			recognizing = false
			$('#enabledVoiceBtn').css('display', 'block')
			$('#disabledVoiceBtn').css('display', 'none')
		}
		
    recognition.onresult = function(event) {
      var interimTranscript = ''
      // Assemble the transcript from the array of results
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }
			console.log('interim:  ' + interimTranscript)
			$userInputField.attr('placeholder', interimTranscript)
      console.log('final:    ' + finalTranscript)
      // update the page
      if (finalTranscript.length > 0) {
        $userInputField.val(finalTranscript)
        recognition.stop()
        // $('#start_button').html('Click to Start Again');
        recognizing = false
      }
    }

    recognition.onnomatch = function() {
      console.log('Speech not recognised');
			$userInputField.attr('placeholder', 'Sorry couldnt hear try again!')
		}
				
    recognition.onerror = function(event) {
			console.log('There was a recognition error...')
			$userInputField.attr('placeholder', 'Sorry couldnt hear try again!')
		}

    $('#userInputVoice').click(function() {
      if (recognizing) {
        recognition.stop()
        // $('#start_button').html('Click to Start Again');
        recognizing = false
      } else {
        finalTranscript = ''
        // Request access to the User's microphone and Start recognizing voice input
        $userInputField.val('')
        recognition.start()
        // console.log('recog: ' + recognition)
      }
    })
  }
})

/**
 * Construct faqs html to be appended
 * @param {any} choices array of choices
 * @returns constructed html of bot choices
 */
function faqs(choices) {
  if (choices !== undefined && choices.length > 1) {
    var choicesBotMessage = '<div class="chatBtnHolder">'
    for (var i = 0; i < choices.length; i++) {
      // choicesBotMessage += '<button class="chatBtn" onclick="choiceClick(\'' + i + '\')" value="' + choices[i] + '">' + choices[i] + '</button>';
      choicesBotMessage += '<button class="chatBtn" value="' + choices[i] + '">' + choices[i] + '</button>'
    }
    choicesBotMessage += '</div>'
    return choicesBotMessage
  }
}

// Feedback Mechanism
$('body').on('click', '.emoji', function() {
  $('.emoji').each(function() {
    $(this).attr('isactive', 'false')
    $(this).removeClass('jqactive')
  })
  $(this).addClass('jqactive')
  $(this).attr('isactive', 'true')
})

$('body').on('click', '#send_feedback', function(e) {
  if ($('textarea').val().length === 0) {
    e.preventDefault()
  } else {
    insertMessage('Thank you for your  rating of ' + $('.emoji.jqactive').attr('rating') + " and your comment '" + $('textarea').val() + "' ")
    feedBack.logs.push({
      finalRating: $('.emoji.jqactive').attr('rating'),
      finalFeedback: $(this).closest('.message').find('textarea').val()
    })
    $(this).prop('disabled', true)
  }
})

$('body').on('click', '.fa-thumbs-down', function() {
  $(this).addClass('f-active')
  $(this).closest('.message').find('.fa-thumbs-up').removeClass('f-active')

  if ($(this).closest('.message').find('.shoutout').length === 0) {
    var temp = $('<div class="shoutout"><br><br><table><tr><td>Let us know why:</td><td><textarea class="shoutout_msg" name="dislike" placeholder="Enter here"></textarea></td><td><i class="fa fa-paper-plane fa-2x" aria-hidden="true"></i></td></tr></table></div>')
    temp.appendTo($(this).closest('.message'))
  }
  var text = $(this).closest('.message').find('.botmessage').text()
  var status = 'not OK'
  registerFeedback(feedBack, status, text)
  console.log(feedBack)
  $(this).closest('.message').find('.shoutout').show()
  $(this).closest('.message').find('.fa-paper-plane').show()
})

$('body').on('click', '.fa-thumbs-up', function() {
  $(this).addClass('f-active')
  $(this).closest('.message').find('.fa-thumbs-down').removeClass('f-active')

  var text = $(this).closest('.message').find('.botmessage').text()
  var status = 'OK'
  registerFeedback(feedBack, status, text)
  console.log(feedBack)
  $(this).closest('.message').find('.shoutout').hide()
})

$('body').on('click', '.fa-paper-plane', function() {
  var text = $(this).closest('.message').find('.botmessage').text()
  var status = 'not OK'
  var bullhornText = $(this).closest('tr').find('.shoutout_msg').val()
  registerFeedback(feedBack, status, text, bullhornText)
  console.log(feedBack)
  $(this).closest('.shoutout').hide()
})

function textclean(user_msg) {
  var res = (user_msg.replace(/[^a-zA-Z ]/g, '')).toLowerCase()
  return res
}

// // Sample for sending bot message
// setTimeout(function () {
//   var botMsg = {}
//   botMsg.message = 'Total revenue earned this year'
//   botMsg.type = 'value'
//   botMsg.value = '60%'
//   botMessage(botMsg)
//   enableUserInput('Please ask your query')
// }, 1000)

var socket = io.connect('http://rasa-thai-backend.azurewebsites.net')
socket.on('connect', function() {
  console.log('connected!')
})
$('#generalForm').submit(function() {
  var msg = $userInputField.val()
  setTyping()
  insertMessage(msg)
  // console.log(PostMessage(msg))
  socket.emit('chat message', PostMessage(textclean(msg)))
  updateScrollbar()
  return false
})

socket.on('chat response', function(msg) {
  enableUserInput('Please enter')
  // console.log("Msg:  \n")
  // console.log(msg)
  botMessage(msg)
  updateScrollbar()
})