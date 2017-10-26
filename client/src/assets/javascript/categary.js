/**
 * Created by dell-pc on 2017/9/25.
 */

//返回顶部
//        动画显示
function show(obj) {
  if(obj.style.opacity==0){
    var opacity = 1;
    var inter = setInterval(function () {
      if (obj.style.opacity < 1) {
        opacity += 1;
        obj.style.opacity = opacity / 100;
      } else {
        clearInterval(inter);
      }
    }, 10);
  }
}
//        动画隐藏
function hide(obj) {
  if(obj.style.opacity==1){
    var opacity = 100;
    var inter = setInterval(function () {
      if (obj.style.opacity >0) {
        opacity -= 1;
        obj.style.opacity = opacity / 100;
      } else {
        clearInterval(inter);
      }
    }, 10)
  }
}
window.onload = function () {
  var oTop = document.getElementById("to_top");
  window.onscroll = function (){
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop> 200) {
      show(oTop);
    } else if (scrollTop <= 200) {
      hide(oTop);
    }
  };
  oTop.onclick = function () {
    var inter = setInterval(function () {
      if (document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
        document.documentElement.scrollTop -= 10;
        document.body.scrollTop -= 20;
      }
      else {
        clearInterval(inter);
      }
    }, 10)
  }
}

