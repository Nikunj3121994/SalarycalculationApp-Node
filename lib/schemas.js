var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

  var UserSchema = new Schema({
    providerId : String,
    _employer : { type: Schema.Types.ObjectId, ref: 'Employer' },
    _employee: { type: Schema.Types.ObjectId, ref: 'Employee' },
    displayName : String
  });
  mongoose.model('User', UserSchema);

  var EmployerSchema = new Schema({
    name : String,
    phone: String,
    employees : [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
  });
  mongoose.model('Employer', EmployerSchema);

  var EmployeeSchema = new Schema({
  	_employer : { type: Schema.Types.ObjectId, ref: 'Employer' },
    pid:   String,
  	name : String,
    phone: String,
    email: String,
    taxPercentage: Number
  });

  mongoose.model('Employee', EmployeeSchema);

  var CalculationSchema = new Schema({
    _employer : { type: Schema.Types.ObjectId, ref: 'Employer' },
    employees: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
    periodStart : Date,
    periodEnd: Date,
    status: String
  });

  mongoose.model('Calculation', CalculationSchema);  

  var CalculationRowSchema = new Schema({
    _calculation : { type: Schema.Types.ObjectId, ref: 'Calculation' },
    _calculationRowType : { type: Schema.Types.ObjectId, ref: 'CalculationRowType' },
    value: Number,
  });

  mongoose.model('CalculationRow', CalculationRowSchema);

  var CalculationRowTypeSchema = new Schema({
    rowType: String,
    code: String,
    friendlynames: [{
      lang: String,
      friendlyName: String
    }]
  });

  mongoose.model('CalculationRowType', CalculationRowTypeSchema);
};