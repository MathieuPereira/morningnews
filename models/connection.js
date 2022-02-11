var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://Mathieu_P:annecy2022@cluster0.zl15k.mongodb.net/morningnews?retryWrites=true&w=majority',
    options,
    function(err){
        err ? console.log(err) : console.log("BDD OK");
    }
)

module.exports = mongoose;