// const slideButton=document.querySelectorAll(".slideButton")
// const filtersB=document.getElementById("filters");

// const { func } = require("joi");

// slideButton.forEach((button)=>{
//     button.addEventListener("click",()=>{
//       const direction= button.classList.contains("leftButton") ? -1:1;
//         const scroll=direction * (filtersB.clientWidth -100);
//         filtersB.scrollBy({left:scroll ,behaviour:"smooth"})
//     })
// })
// filtersB.addEventListener("scroll",()=>{
//     slideButton[0].style.display=filtersB.scrollLeft <=0 ? "none":"flex"
//    slideButton[1].style.display = filtersB.scrollLeft >= (filtersB.scrollWidth-filtersB.clientWidth-5) ? "none" : "flex"
// })

// const slideButtons = document.querySelectorAll(".slideButton");
// const filtersB = document.getElementById("filters");

// slideButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     console.log("button was clicked",button)
//     const direction = button.classList.contains("leftButton") ? -1 : 1;
//     const scrollAmount = direction * (filtersB.clientWidth - 100);
//     filtersB.scrollBy({ left: scrollAmount, behavior: "smooth" });
//   });
// });

// filtersB.addEventListener("scroll", () => {
//   slideButtons[0].style.display = filtersB.scrollLeft <= 0 ? "none" : "flex";
//   slideButtons[1].style.display = filtersB.scrollLeft >= (filtersB.scrollWidth - filtersB.clientWidth - 5) ? "none" : "flex";
// });

// const slideButtons = document.querySelectorAll(".slideButton");
// const filtersB = document.getElementById("filters");

// slideButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     console.log(`Button clicked: ${button.className}`); // Check class names
//     const direction = button.classList.contains("leftButton") ? -1 : 1;
//     const scrollAmount = direction * (filtersB.clientWidth - 100);
//     console.log(`Direction: ${direction}, Scroll Amount: ${scrollAmount}`); // Debug scroll amount
//     filtersB.scrollBy({ left: scrollAmount, behavior: "smooth" });
//   });
// });

// filtersB.addEventListener("scroll", () => {
//   slideButtons[0].style.display = filtersB.scrollLeft <= 0 ? "none" : "flex";
//   slideButtons[1].style.display = filtersB.scrollLeft >= (filtersB.scrollWidth - filtersB.clientWidth - 5) ? "none" : "flex";
// });

// let filtersBox = document.querySelector("#filters");
// let buttonSlide = document.querySelectorAll("#slideButton");

// buttonSlide.forEach((button) => {
// 	button.addEventListener("click", () => {
// 		const direction = button.className == "left_img_button" ? -1 : 1;
// 		const scrollImg = direction * (filtersBox.clientWidth - 100);
// 		filtersBox.scrollBy({ left: scrollImg, behavior: "smooth" });
// 	});
// });

// filtersBox.addEventListener("scroll", () => {
// 		buttonSlide[0].style.display = filtersBox.scrollLeft <= 0 ? "none" : "flex"
// 		buttonSlide[1].style.display = filtersBox.scrollLeft >= (filtersBox.scrollWidth-filtersBox.clientWidth-5) ? "none" : "flex"
// 		console.log(filtersBox.scrollWidth)
// 		console.log(filtersBox.scrollWidth-filtersBox.clientWidth)
// })

let filterBox=document.getElementsByClassName("filters");
// let [leftButton,rightButton]=document.querySelectorAll("#slideButton")
let leftButton=document.getElementsByClassName("leftButton")
let rightButton=document.getElementsByClassName("rightButton")
function handleScroll(direction){
	const scrollAmount=filterBox.clientWidth-100; //calculate scroll distance
	filterBox.scrollBy({left:direction*scrollAmount,behavior:"smooth"});//scroll left or right
}
leftButton.addEventListener("click",()=>{
	handleScroll(-1)
})
rightButton.addEventListener("click",()=>{
	handleScroll(1)
})

