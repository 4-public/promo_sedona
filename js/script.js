/* Header menu show/hide btn */

window.onload = function menuShowButton(){
  var Header = document.getElementsByTagName("header")[0];
  var btn = Header.getElementsByClassName("menu-show-btn")[0];
  var menu = Header.getElementsByClassName("mobile")[0];
  var Toggle = function(){
      menu.classList.toggle("menu-show-btn-active");
    };
  if (btn.addEventListener)
    btn.addEventListener("click", Toggle, false);
  else if (btn.attachEvent)
    btn.attachEvent("onclick", Toggle);
}();




/* Popup form: dateInput focusing */

function dateFocus(){
  var din = document.getElementById("din");
  var dout = document.getElementById("dout");
  var Select = function(){
    this.select();
  };
  din.addEventListener("click", Select, false);
  dout.addEventListener("click", Select, false);
};




/* Filter form: hotelCostInput focusing */

function costFocus(){
  var cfrom = document.getElementsByClassName("cost-from")[0];
  var cto = document.getElementsByClassName("cost-to")[0];
  var Select = function(){
    this.select();
  };
  cfrom.addEventListener("click", Select, false);
  cto.addEventListener("click", Select, false);
};




/* Search form: number of people toggler */

window.onload = function(){
  var isIndex = document.getElementsByTagName("title")[0].innerHTML;
  if (isIndex.search(/\sInformation$/) === -1) return;

  dateFocus(); /* launching dateInput focusing */

  google.maps.event.addDomListener(window, 'load', initialize); /* lauching Google Maps */

  var less = document.getElementsByClassName("less");
  var more = document.getElementsByClassName("more");
  var adult = document.getElementsByClassName("count-adult")[0];
  var child = document.getElementsByClassName("count-child")[0];
  var adultInput = adult.getElementsByTagName("input")[0];
  var childInput = child.getElementsByTagName("input")[0];

  less[0].addEventListener("click", AmountChange, false);
  less[1].addEventListener("click", AmountChange, false);
  more[0].addEventListener("click", AmountChange, false);
  more[1].addEventListener("click", AmountChange, false);

function AmountChange(event){
  var tempx;
  var isInt = function(x){
    if (!isNaN(parseInt(x)) && isFinite(x)){
      return x - (x % 1);
    }
    else return 2;
  };
  if (adult.contains(this))
    if (this.className.search(/(^|\s)less(\s|$)/) !== -1){
          tempx = isInt(adultInput.value);
          tempx > 0 ? adultInput.value = tempx - 1 : adultInput.value = tempx;
        }
    else {
          tempx = isInt(adultInput.value) + 1;
          adultInput.value = tempx;
        }
  else
    if (this.className.search(/(^|\s)less(\s|$)/) !== -1){
          tempx = isInt(childInput.value);
          tempx > 0 ? childInput.value = tempx - 1 : childInput.value = tempx;
        }
    else {
          tempx = isInt(childInput.value) + 1;
          childInput.value = tempx;
        }
};
}();




      /* Google Maps localizing */

function initialize() {
  var mapOptions = {
    scrollwheel: false,
    zoom: 10,
    center: new google.maps.LatLng(34.8779702,-111.755828)
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}




      /* Filter: Col 3 cost input/roller */

window.onload = function() {
  var isHotels = document.getElementsByTagName("title")[0].innerHTML;
  if (isHotels.search(/\shotels$/) === -1) return;

  costFocus(); /* launching hotelcostInput focusing */

  var togMin = document.getElementsByClassName("toggle-min")[0];
  var togMax = document.getElementsByClassName("toggle-max")[0];
  var scale = document.getElementsByClassName("scale")[0];
  var scaleBar = document.getElementsByClassName("scale-bar")[0];
  var costFrom = document.getElementsByClassName("cost-from")[0];
  var costTo = document.getElementsByClassName("cost-to")[0];
  togMin.addEventListener("mousedown", dragToggle, false);
  togMax.addEventListener("mousedown", dragToggle, false);


// Определяет длинну полос прокрутки
  function getScrollOffsets(w){
    // Использовать указанное окно или текущее,
    // если функция вызвана без аргумента
    w = w || window;
    // работает во всех броузерах, кроме IE версии 8 и ниже
    if (w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};
    // Для IE (и других броузеров) в стандартном режиме
    var d = w.document;
    if (document.compactMode == "CSS1Compact")
      return {x: d.documentElement.scrollLeft,
              y:d.documentElement.scrollTop};
    // Для броузеров в режиме совместимости
    return {x: d.body.scrollLeft, y: d.body.scrollTop};
  };

        //===========//
  function dragToggle(event){
    var offsetX = getScrollOffsets();

    var touchedTog = this;// Змінній присвоєно об'єкт обробника

    // Визначає положення по осі Х батьківського елемента відносно документа:
              //scaleW: scaleBox.width || (scaleBox.right - scaleBox.left)
      var scaleBox = scale.getBoundingClientRect();
      var scaleLeft = scaleBox.left + offsetX.x;

    // Визначає положення бігунка по осі Х відносно документа
    function ToggleParam() {
      var togSideMin = togMin.getBoundingClientRect();
      var togSideMax = togMax.getBoundingClientRect();
      return { tMinX: togSideMin.left + offsetX.x,
                tMaxX: togSideMax.left + offsetX.x,
                scaleWidth: scaleBox.width,
                togWidth: togSideMin.width}
    }
    // Визначеємо координати миші в точці mousedown по осі Х відносно документа
    var mouseTouch = event.clientX + offsetX.x;

    // Знаходимо різницю між точкою mousedown і лівою стороною натиснутого
    // бігунка
    var param = ToggleParam();
    var delta = mouseTouch - function(){
                              if (touchedTog == togMin)
                                return param.tMinX;
                              else return param.tMaxX;
                              }();

  // Визначаємо межі переміщення бігунків
  var leftLimit = 0;
  var rightLimit = param.tMaxX - param.togWidth - scaleLeft;
  (function (){
    if (touchedTog == togMax){
      leftLimit = param.tMinX + param.togWidth - scaleLeft;
      rightLimit = param.scaleWidth - param.togWidth;
    }
  })();

    // Визначаємо ділення шкали
    var scaleDivide = (param.scaleWidth - param.togWidth) / 100;

    // Визначаємо початкові значення стилів підсвітки шкали
      var barMarginLeft = parseInt(window.getComputedStyle(scaleBar, "").marginLeft);
      var barWidth = window.getComputedStyle(scaleBar, "").width;

    // Реєструємо обробники перетягування і відпускання бігунка:
    document.addEventListener("mousemove", Moving, true);
    document.addEventListener("mouseup", stopMoving, true);
    // Не передавати подію іншим обробникам
    event.stopPropagation();
    event.preventDefault();

    // Обробник переміщення
    function Moving(event){
      var offsetX = getScrollOffsets();
      // Перевірка
      var current = event.clientX + offsetX.x - delta - scaleLeft;
      var allowedStyle = function(){
        if (current >= rightLimit)
          return rightLimit;
        else if (current <= leftLimit)
          return leftLimit;
          else return current;
      }();
      // Змістити бігунок в позицію вказівника миші
      touchedTog.style.left = allowedStyle + "px";
      // Підганяємо розмір шкали під проміжок між бігунками
      if (touchedTog == togMin){
        scaleBar.style.marginLeft = allowedStyle + "px";
        scaleBar.style.width = param.tMaxX - scaleLeft - allowedStyle + "px";
        // Задаємо значення полів input залежно від положення бігунка
        costFrom.value = Math.round(allowedStyle / scaleDivide) * 100;
      }
      else {
        scaleBar.style.width = allowedStyle - barMarginLeft + "px";
        costTo.value = Math.round(allowedStyle / scaleDivide) * 100;
      };

      event.stopPropagation();
    };

    // Обробник відпускання бігунка
    function stopMoving(event){
      document.removeEventListener("mouseup", stopMoving, true);
      document.removeEventListener("mousemove", Moving, true);
      event.stopPropagation();
    };
  };
}();