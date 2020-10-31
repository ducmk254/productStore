let axios = require("axios");
let getData = async (url)=>{
    try {
        var data = await axios.get(url)
                              .then(response=>{
                                  return response;
                              })
        if(data.status == 200){
            console.log(data.data);
        }else{
            console.log(data.message);
        }
    } catch (error) {
        return error;
    }
    
}

console.log(getData('http://localhost:5000/api/v0/books'));