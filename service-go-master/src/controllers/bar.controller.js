export const getProgressBar = async (req,res) =>{
    res.render('bar')
}

export const move = () =>  {
    var elem = document.getElementById("myBar");   
    var width = 50;
    var id = setInterval(frame, 10);
    function frame() {
      //if (width >= 100) {
       // clearInterval(id);
      //} else {
       // width++;
        elem.style.width = width + '%'; 
     // }
    }
  }