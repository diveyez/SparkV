$(document).ready = () => {
  $(document).ready(function(){
    $("a").on("click", function(event){
      if (this.hash !== ""){
        event.preventDefault()
  
        var hash = this.hash
  
        $("html, body").animate({
          scrollTop: $(hash).offset().top
        }, 800, function(){
          window.location.hash = hash
        })
      }
    })
  })
}

$(window).onload = () => {
  const headfade = document.querySelector(".headfade")
  const navbar = document.querySelector(".nav-bar")
  const navlinks = document.querySelectorAll(".nav-bar li")

  if ($(window).scrollTop()){
    $("header").addClass("nav-show")
  } else {
    $("header").removeClass("nav-show")
  }

  headfade.onclick = () => {
    navbar.classList.toggle("nav-active")

    navlinks.forEach((link, index) => {
      if (link.style.animation){
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5 ease forwards ${index / 7+1}s`;
    }
  })

  headfade.classList.toggle("toggle")
  }
}