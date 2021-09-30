const router = require('express').Router();
require('dotenv').config();
const moment= require('moment') 
const Test = require('../modals/Test');

//Get Lab tests for nurse
router.route('/getSampleCollections_today').get(async(req, res) => {
    
    try {
        await Test.find({})
        .populate('patient' , 'fullName age dateOfBirth')
        .populate('doctor' , 'fullName email')
        .then((tests) => {
            var todayTests = [];
            var todayCompleatedTestsCount = 0;
            
            tests.map(test => {
                if(moment(test.date).isSame(moment() , 'day') && test.specimonNumber == null){
                    todayTests.push(test);
                }
                if(moment(test.date).isSame(moment() , 'day') && test.specimonNumber != null){
                    todayCompleatedTestsCount++
                }
            })
            let sortedtodayTests = todayTests.sort(function(a, b){
                return moment(a.date).diff(b.date);
            });
            let totalTetsCount = tests.length;
            let testsToComplete = todayTests.length;
            let compleatedTests = todayCompleatedTestsCount;
            let testsCountForToday = testsToComplete + compleatedTests;
            let completePercentage = (compleatedTests/testsCountForToday) * 100;
            let incompletePercentage = 100 - completePercentage;
            res.json({sortedtodayTests : sortedtodayTests , 
                totalTetsCount : totalTetsCount, 
                testsToComplete : testsToComplete, 
                compleatedTests : compleatedTests, 
                testsCountForToday:testsCountForToday,
                completePercentage:completePercentage,
            incompletePercentage:incompletePercentage});
        }).catch((err) => {
            res.json({err});
        })
    } catch (error) {
       console.log(error)
       res.json({error: error})
    }
})

//get test by test id
router.route('/getById/:id').get(async(req, res) => {
    
    try {
       await Test.find({ _id: req.params.id})
       .populate('doctor')
       .populate('patient')
       .then(data => {
            var age = moment().diff(data[0].patient.dateOfBirth, 'years',false);
            res.json({data : data , age:age});
        }).catch((err) => {
            res.json({err});
        })
    } catch (error) {
       console.log(error)
       res.json({error: error})
    }})

    //patient profile update
router.put('/createRequest', async (req,res) => {
    try{
        const  updateValue = await Test.findOneAndUpdate({ _id: req.body._id }, { specimonNumber: req.body.specimonNumber, specimonType: req.body.specimonType, status: req.body.status }).then(() => {
            res.json({status:200, message:'ok'})
        }).catch((err) => {
            res.json({status:400, error:err})
        })
    }catch(err){
        console.log(err)
        res.json({error: err})
    }
    // console.log(pass)

})


module.exports = router;