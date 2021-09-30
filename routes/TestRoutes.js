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
            let completePercentage = Math.round((compleatedTests/testsCountForToday) * 100);
            let incompletePercentage = Math.round(100 - completePercentage);
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

//Create lab test request by nurse
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


router.route('/getTestsForLabStaff').get(async(req, res) => {
    
    try {
        await Test.find({})
        .populate('patient' , 'fullName age dateOfBirth')
        .populate('doctor' , 'fullName email')
        .then((tests) => {
            var todayTests = [];
            var todayCompleatedTestsCount = 0;
            var newTestsCount = 0;
            var completedTestsCount = 0;
            var publishedTestsCount = 0;
            var inProgressTestsCount = 0;
            
            tests.map(test => {
                if(moment(test.date).isSame(moment() , 'day') && test.specimonNumber == null){
                    todayTests.push(test);
                }
                if(moment(test.date).isSame(moment() , 'day') && test.specimonNumber != null){
                    todayCompleatedTestsCount++
                }
                if(test.status === "New"){
                    newTestsCount++;
                }
                if(test.specimonNumber === "Completed"){
                    completedTestsCount++;
                }
                if(test.specimonNumber === "Published"){
                    publishedTestsCount++;
                }
                if(test.specimonNumber === "InProgress"){
                    inProgressTestsCount++;
                }
            })
            let sortedtodayTests = todayTests.sort(function(a, b){
                return moment(a.date).diff(b.date);
            });
            let totalCollectedRequests = inProgressTestsCount + newTestsCount + completedTestsCount + publishedTestsCount;
            let newPercentage = Math.round((newTestsCount/totalCollectedRequests)* 100)
            let inProgressPercentage = Math.round((inProgressTestsCount/totalCollectedRequests)* 100)
            let completedTestPercentage = Math.round((completedTestsCount/totalCollectedRequests)* 100)
            let publishedPercentage = Math.round((publishedTestsCount/totalCollectedRequests)* 100)
            let compleatedTests = todayCompleatedTestsCount;
            let testsToComplete = todayTests.length;
            let testsCountForToday = testsToComplete + compleatedTests;
            let totalTetsCount = tests.length;
            let completePercentage = Math.round((compleatedTests/testsCountForToday) * 100);
            let incompletePercentage = Math.round(100 - completePercentage);
            res.json({sortedtodayTests : sortedtodayTests , 
                totalTetsCount : totalTetsCount, 
                testsToComplete : testsToComplete, 
                compleatedTests : compleatedTests, 
                testsCountForToday:testsCountForToday,
                completePercentage:completePercentage,
                incompletePercentage:incompletePercentage,
                newPercentage:newPercentage,
                inProgressPercentage:inProgressPercentage,
                completedTestPercentage:completedTestPercentage,
                publishedPercentage:publishedPercentage,
                newTestsCount:newTestsCount,
                completedTestsCount:completedTestsCount,
                publishedTestsCount:publishedTestsCount,
                inProgressTestsCount:inProgressTestsCount,
            });
        }).catch((err) => {
            res.json({err});
        })
    } catch (error) {
       console.log(error)
       res.json({error: error})
    }
})

//get test by test id for lab staff
router.route('/getByIdForStaff/:id').get(async(req, res) => {
    
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

    //get test by test id for lab staff
    router.put('/saveReport', async (req,res) => {
        try{
            const  updateValue = await Test.findOneAndUpdate({ _id: req.body._id }, { specialRemarks: req.body.specialRemarks, results: req.body.results , status: req.body.status}).then(() => {
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