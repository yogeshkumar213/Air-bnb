let taxSwitch=document.getElementById("flexSwitchCheckDefault")
let ChangeThings=document.getElementsByClassName("change-things")
let priceInfo=document.getElementsByName("price-info")
taxSwitch.addEventListener("click",()=>{
    let taxInfo=document.getElementsByClassName("tax-info");
    for(info of taxInfo){
        if(info.style.display !="inline"){
            info.style.display="inline"
            
            
        }else{
            info.style.display="none"
        }
    }
  })