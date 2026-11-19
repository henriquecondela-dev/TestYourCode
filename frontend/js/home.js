const token=sessionStorage.getItem("token");
const startLinks=document.querySelectorAll(".start-link");

if(token){
    startLinks.forEach(function(link){
        link.href="../pages/index.html";
    });
}
