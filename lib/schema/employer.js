var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
  var EmployerSchema = new Schema({
    name : String,
    phone: String,
    employees : [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
    });
  mongoose.model('Employer', EmployerSchema);

  var EmployeeSchema = new Schema({
  	_employer : { type: Schema.Types.ObjectId, ref: 'Employer' },
  	name : String,
    phone: String,
    email: String
  });

  mongoose.model('Employee', EmployeeSchema);  
};