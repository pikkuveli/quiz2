var $progressValue = 0;
var resultList = [];


const quizdata = [
  {
    question: "Kuinka monta asukasta Suomessa oli vuoden 2018 lopussa?",
    options: ["noin 4,5 miljoonaa", "noin 5 miljoonaa", "noin 5,5 miljoonaa", "noin 6 miljoonaa"],
    answer: "noin 5,5 miljoonaa",
    category: 1
  },
  {
    question: "Kuinka monta ylioppilasta valmistui vuonna 2017?",
    options: ["noin 21 000", "noin 26 000", "noin 31 000", "noin 36 000"],
    answer: "noin 31 000",
    category: 1
  },
  {
    question: "Paljonko voita nautittiin Suomessa asukasta kohden vuonna 2017? (ennakkotieto)",
    options: ["0,5 kiloa", "1,5 kiloa", "2,5 kiloa", "3,5 kiloa"],
    answer: "3,5 kiloa",
    category: 1
  },
  {
    question: "Mikä oli suomalaisten suosituin matkakohde vuonna 2018?",
    options: ["Espanja", "Viro", "Ruotsi", "Saksa"],
    answer: "Viro",
    category: 1
  },
  {
    question: "Mikä laite oli suosituin suomalaisissa kotitalouksissa vuonna 2018?",
    options: ["tietokone", "älypuhelin", "gps-navigaattori", "kamerakopteri"],
    answer: "tietokone",
    category: 1
  },
  {
    question: "Kuinka monta kertaa suomalainen kävi keskimäärin elokuvateatterissa vuonna 2018?",
    options: ["1 kerran", "1,5 kertaa", "2 kertaa", "3,5 kertaa"],
    answer: "1,5 kertaa",
    category: 1
  },
  {
    question: "Mikä oli Suomen suosituin auton väri vuonna 2018?",
    options: ["musta", "harmaa", "valkoinen", "keltainen"],
    answer: "harmaa",
    category: 1
  },
  {
    question: "Mihin maahan Suomesta vietiin eniten tavaroita vuonna 2018?",
    options: ["Ruotsiin", "Yhdysvaltoihin", "Alankomaihin", "Saksaan"],
    answer: "Saksaan",
    category: 1
  },
  {
    question: "Mikä oli vuonna 2018 syntyneiden tyttöjen suosituin etunimi?",
    options: ["Eevi", "Sofia", "Venla", "Ella"],
    answer: "Eevi",
    category: 1
  },
  {
    question: "Mikä oli asukasmäärältään Suomen suurin kunta vuoden 2018 lopussa?",
    options: ["Tampere", "Helsinki", "Espoo", "Vantaa"],
    answer: "Helsinki",
    category: 1
  }
];

/** Random shuffle questions **/
function shuffleArray(question) {
  var shuffled = question.sort(function () {
    return .5 - Math.random();
  });
  return shuffled;
}

/*** Return shuffled question ***/
function generateQuestions() {
  var questions = shuffleArray(quizdata);
  return questions;
}

/*** Return list of options ***/
function returnOptionList(opts, i) {

  var optionHtml = '<li class="myoptions">' +
    '<input value="' + opts + '" name="optRdBtn" type="radio" id="rd_' + i + '">' +
    '<label for="rd_' + i + '">' + opts + '</label>' +
    '<div class="bullet">' +
    '<div class="line zero"></div>' +
    '<div class="line one"></div>' +
    '<div class="line two"></div>' +
    '<div class="line three"></div>' +
    '<div class="line four"></div>' +
    '<div class="line five"></div>' +
    '<div class="line six"></div>' +
    '<div class="line seven"></div>' +
    '</div>' +
    '</li>';

  return optionHtml;
}

/** Render Options **/
function renderOptions(optionList) {
  var ulContainer = $('<ul>').attr('id', 'optionList');
  for (var i = 0, len = optionList.length; i < len; i++) {
    var optionContainer = returnOptionList(optionList[i], i)
    ulContainer.append(optionContainer);
  }
  $(".answerOptions").html('').append(ulContainer);
}

/** Render question **/
function renderQuestion(question) {
  $(".question").html("<h1>" + question + "</h1>");
}

/** Render quiz :: Question and option **/
function renderQuiz(questions, index) {
  var currentQuest = questions[index];
  renderQuestion(currentQuest.question);
  renderOptions(currentQuest.options);
  console.log("Question");
  console.log(questions[index]);
}

/** Return correct answer of a question ***/
function getCorrectAnswer(questions, index) {
  return questions[index].answer;
}

/** pushanswers in array **/
function correctAnswerArray(resultByCat) {
  var arrayForChart = [];
  for (var i = 0; i < resultByCat.length; i++) {
    arrayForChart.push(resultByCat[i].correctanswer);
  }

  return arrayForChart;
}

/** Generate array for percentage calculation **/
function genResultArray(results, wrong) {
  var resultByCat = resultByCategory(results);
  var arrayForChart = correctAnswerArray(resultByCat);
  arrayForChart.push(wrong);
  return arrayForChart;
}

/** count right and wrong answer number **/
function countAnswers(results) {

  var countCorrect = 0, countWrong = 0;

  for (var i = 0; i < results.length; i++) {
    if (results[i].iscorrect == true)
      countCorrect++;
    else countWrong++;
  }

  return [countCorrect, countWrong];
}

/**** Categorize result *****/
function resultByCategory(results) {

  var categoryCount = [];
  var ctArray = results.reduce(function (res, value) {
    if (!res[value.category]) {
      res[value.category] = {
        category: value.category,
        correctanswer: 0
      };
      categoryCount.push(res[value.category])
    }
    var val = (value.iscorrect == true) ? 1 : 0;
    res[value.category].correctanswer += val;
    return res;
  }, {});

  categoryCount.sort(function (a, b) {
    return a.category - b.category;
  });

  return categoryCount;
}

/** List question and your answer and correct answer  

*****/
function getAllAnswer(results) {
  var innerhtml = "";
  for (var i = 0; i < results.length; i++) {

    var _class = ((results[i].iscorrect) ? "item-correct" : "item-incorrect");
    var _classH = ((results[i].iscorrect) ? "h-correct" : "h-incorrect");


    var _html = '<div class="_resultboard ' + _class + '">' +
      '<div class="_header">' + results[i].question + '</div>' +
      '<div class="_yourans ' + _classH + '">' + results[i].clicked + '</div>';

    var html = "";
    if (!results[i].iscorrect)
      html = '<div class="_correct">' + results[i].answer + '</div>';
    _html = (_html + html) + '</div>';
    innerhtml += _html;
  }

  $(".allAnswerBox").html('').append(innerhtml);
}

/** render  Brief Result **/
function renderResult(resultList) {

  var results = resultList;
  var countCorrect = countAnswers(results)[0];

  if(countCorrect>=0 && countCorrect<=3){
    $("._result_photo1").show();
    $("._result_photo2").hide();
    $("._result_photo3").hide();
    $("#_result_h2").find("._result_title").html("Tilastot ovat sinulle kummajaisia!");
    $("#_results_area").find("._result_text").html("Nyt ei mennyt ihan nappiin, mutta ei hätää. Voit tutustua Suomi lukuina -taskutilastoon ja yrittää uudelleen.");
	$("#_share_buttons1").show();
	$("#_share_buttons2").hide();
	$("#_share_buttons3").hide();
  } else if (countCorrect >= 4 && countCorrect <= 7) {
    $("._result_photo1").hide();
    $("._result_photo2").show();
    $("._result_photo3").hide();
    $("#_result_h2").find("._result_title").html("Olet melkein mestari!");
    $("#_results_area").find("._result_text").html("Olet jo lähellä tilastotietäjien huipputasoa.");
	$("#_share_buttons1").hide();
	$("#_share_buttons2").show();
	$("#_share_buttons3").hide();
  } else{
    $("._result_photo1").hide();
    $("._result_photo2").hide();
    $("._result_photo3").show();
    $("#_result_h2").find("._result_title").html("Olet tilastovelho!");
    $("#_results_area").find("._result_text").html("Onnittelut hienosta tuloksesta! Tiedät kaiken oleellisen Suomen luvuista.");
	$("#_share_buttons1").hide();
	$("#_share_buttons2").hide();
	$("#_share_buttons3").show();
  }

  $("#_results_area").find("._correct_number").html(countCorrect);
  $("#_results_area").find("._total_number").html(resultList.length);
}

/** Insert progress bar in html **/
function getProgressindicator(length) {
  var progressbarhtml = " ";
  for (var i = 0; i < length; i++) {
    progressbarhtml += '<div class="my-progress-indicator progress_' + (i + 1) + ' ' + ((i == 0) ? "active" : "") + '"></div>';
  }
  $(progressbarhtml).insertAfter(".my-progress-bar");
}

/*** change progress bar when next button is clicked ***/
function changeProgressValue() {
  $progressValue += 11;
  if ($progressValue >= 100) {

  } else {
    if ($progressValue == 99) $progressValue = 100;
    $('.my-progress')
      .find('.my-progress-indicator.active')
      .next('.my-progress-indicator')
      .addClass('active');
    $('progress').val($progressValue);
  }
  $('.js-my-progress-completion').html($('progress').val() + '% complete');
}

function addClickedAnswerToResult(questions, presentIndex, clicked) {
  var correct = getCorrectAnswer(questions, presentIndex);
  var result = {
    index: presentIndex,
    question: questions[presentIndex].question,
    clicked: clicked,
    iscorrect: (clicked == correct) ? true : false,
    answer: correct,
    category: questions[presentIndex].category
  }
  resultList.push(result);

  console.log("result");
  console.log(result);
}

$(document).ready(function () {

  var presentIndex = 0;
  var clicked = 0;

  var questions = generateQuestions();
  renderQuiz(questions, presentIndex);
  getProgressindicator(questions.length);

  $(".answerOptions ").on('click', '.myoptions>input', function (e) {
    clicked = $(this).val();

    if (questions.length == (presentIndex + 1)) {
      $("#submit").removeClass('hidden');
      $("#next").addClass("hidden");
    }
    else {

      $("#next").removeClass("hidden");
    }



  });



  $("#next").on('click', function (e) {
    e.preventDefault();
    addClickedAnswerToResult(questions, presentIndex, clicked);

    $(this).addClass("hidden");

    presentIndex++;
    renderQuiz(questions, presentIndex);
    changeProgressValue();
  });

  $("#submit").on('click', function (e) {
    addClickedAnswerToResult(questions, presentIndex, clicked);
    $('.multipleChoiceQues').hide();
    $(".resultArea").show();
    renderResult(resultList);

  });

  $(".resultArea").on('click', '.backBtn', function () {
    $(".resultPage1").show();
    $(".resultPage3").hide();
    renderResult(resultList);
  });

  $(".resultArea").on('click', '.viewanswer', function () {
    $(".resultPage3").show();
    $(".resultPage1").hide();
    getAllAnswer(resultList);
  });

  $(".resultArea").on('click', '.replay', function () {
    window.location.reload(true);
  });

});

