// ===============================
// UCCEC MAIN JAVASCRIPT
// ===============================


// ===== SCROLL PROGRESS BAR =====
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / height) * 100;

    const bar = document.getElementById("scroll-progress");

    if (bar) {
        bar.style.width = progress + "%";
    }
}

window.addEventListener("scroll", updateScrollProgress);




// ===== DARK / LIGHT MODE TOGGLE =====

const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;


const savedTheme = localStorage.getItem("theme") || "light";

html.setAttribute("data-theme", savedTheme);



function updateThemeIcon(){

    if(!themeToggle) return;

    const icon = themeToggle.querySelector("i");

    if(!icon) return;


    if(html.getAttribute("data-theme") === "dark"){
        icon.className = "fas fa-sun";
    }
    else{
        icon.className = "fas fa-moon";
    }

}


updateThemeIcon();



if(themeToggle){

    themeToggle.addEventListener("click",()=>{


        const current =
        html.getAttribute("data-theme");


        const newTheme =
        current === "dark" ? "light" : "dark";


        html.setAttribute(
            "data-theme",
            newTheme
        );


        localStorage.setItem(
            "theme",
            newTheme
        );


        updateThemeIcon();


    });

}






// ===== MOBILE MENU =====


const menuToggle =
document.querySelector(".menu-toggle");


const navLinks =
document.querySelector(".nav-links");



if(menuToggle && navLinks){


menuToggle.addEventListener("click",()=>{


    navLinks.classList.toggle("active");


    menuToggle.classList.toggle("open");


});



document.querySelectorAll(".nav-links a")
.forEach(link=>{


    link.addEventListener("click",()=>{

        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");

    });


});


}







// ===== SMOOTH SCROLL =====


document.querySelectorAll('a[href^="#"]')
.forEach(anchor=>{


anchor.addEventListener("click",function(e){


const target =
document.querySelector(
this.getAttribute("href")
);


if(target){

e.preventDefault();


target.scrollIntoView({

behavior:"smooth"

});


}


});


});








// ===== NAVBAR SHADOW =====


const navbar =
document.querySelector(".navbar");


window.addEventListener("scroll",()=>{


if(!navbar) return;


if(window.scrollY > 50){

navbar.classList.add("scrolled");

}

else{

navbar.classList.remove("scrolled");

}


});









// ===== COUNTER ANIMATION =====


function animateCounter(element,target){


let start = 0;

const duration = 2000;

const stepTime = 20;


const increment =
target / (duration / stepTime);



const timer =
setInterval(()=>{


start += increment;



if(start >= target){

element.textContent =
target.toLocaleString();

clearInterval(timer);

}

else{

element.textContent =
Math.floor(start).toLocaleString();

}


},stepTime);



}




const stats =
document.querySelectorAll(".stat-item");



const statObserver =
new IntersectionObserver(entries=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


const number =
entry.target.querySelector("h2");


if(number && !number.dataset.done){


const value =
parseInt(
number.textContent.replace(/\D/g,"")
);


if(!isNaN(value)){

animateCounter(number,value);

number.dataset.done="true";

}


}


statObserver.unobserve(entry.target);


}



});


},{threshold:0.5});



stats.forEach(stat=>{

statObserver.observe(stat);

});









// ===== IMAGE LAZY LOAD =====


const images =
document.querySelectorAll("img[data-src]");


const imageObserver =
new IntersectionObserver(entries=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


const img =
entry.target;


img.src =
img.dataset.src;


imageObserver.unobserve(img);


}


});


});



images.forEach(img=>{

imageObserver.observe(img);

});









// ===== FORM VALIDATION =====


function validateEmail(email){

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
.test(email);

}



document.querySelectorAll("form")
.forEach(form=>{


form.addEventListener("submit",e=>{


e.preventDefault();


let valid=true;


form.querySelectorAll("input,textarea")
.forEach(input=>{


if(!input.value.trim()){

input.style.borderColor="red";

valid=false;

}

else if(
input.type==="email" &&
!validateEmail(input.value)
){

input.style.borderColor="red";

valid=false;

}

else{

input.style.borderColor="#ddd";

}


});



if(valid){

alert(
"Thank you! Your message has been received."
);

form.reset();


}



});


});









// ===== BACK TO TOP BUTTON =====


function createBackToTop(){


const button =
document.createElement("button");


button.innerHTML =
'<i class="fas fa-arrow-up"></i>';


button.className =
"back-to-top";



document.body.appendChild(button);



window.addEventListener("scroll",()=>{


button.style.display =
window.scrollY > 300
?
"flex"
:
"none";


});



button.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};



}



createBackToTop();








// ===== PAGE LOADING =====


window.addEventListener("load",()=>{


const loader =
document.getElementById("loader");


if(loader){


setTimeout(()=>{


loader.style.display="none";


},1000);


}



});





console.log(
"%c UCCEC Website Loaded Successfully",
"color:#2d5016;font-size:18px;font-weight:bold;"
);