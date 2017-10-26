/**
 * Created by Administrator on 2017/9/25.
 */
function theme_js() {
  var odiv = document.getElementById('div1');
  var ali = odiv.getElementsByTagName('li');
  var adiv = odiv.getElementsByClassName('class');
  for (var i = 0; i < ali.length; i++) {
    ali[i].index = i;
    ali[i].onclick = function () {
      for (var i = 0; i < ali.length; i++) {
        ali[i].className = '';
        adiv[i].style.display = 'none';
      }
      adiv[this.index].style.display = 'block';
    }
  };
}
