$(document).ready(function() {
  setTimeout(() => {
    $('[data-toggle="tooltip"]').tooltip()
  }, 500)
  //Checking if localStorage is supported
  if (typeof(Storage) !== "undefined") {
    // console.log("Web Storage Online")
  } else {
    alert('Sorry! No Web Storage support')
  }

  //Welcome page transition animations
  $("#logo-intro").fadeIn(2000)
  setTimeout(function() {
    $("#btns-intro").fadeIn("slow")
  }, 1500)

  $("#login-prompt").click(function() {
    $(".welcome-start").hide()
    $("#login-form").fadeIn("slow")
  })

  $("#close-login-form").click(function() {
    $("#login-form").hide()
    $(".welcome-start").fadeIn()
  })

  $(".btn.nav-link").click(function() {
    $("#container-fade").hide()
    $("#container-fade").fadeIn()
  })

  // if (menuHide) {
  //   $("#hide-menu-btn").removeClass("rotate")
  //   $("#main-menu").css({"width": "50px"})
  //   $("#hide-menu-btn").css({"left": "50px"})
  // } else {
  //   $("#hide-menu-btn").addClass("rotate")
  //   $("#main-menu").css({"width": "0px"})
  //   $("#hide-menu-btn").css({"left": "5px"})
  // }
})


