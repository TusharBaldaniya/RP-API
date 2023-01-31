// const fs = require('fs');
const Tour = require('../model/tourmodel');
const catchasync = require('../util/catchAsync');

exports.gettour = async (req, res) => {
    try {
        //Filtering


        const queryobj = { ...req.query };
        const exclidedFields = ['page', 'sort', 'limit', 'fields'];
        exclidedFields.forEach(el => delete queryobj[el]);
        //console.log(queryobj);
        const querystr = JSON.stringify(queryobj);
        let query;
        query = Tour.find({ createdby: req.user.id }).populate('createdby');
        if (req.user.role === "admin") query = Tour.find().populate('createdby');
        //console.log(querystr);
        // console.log(req.query.sort);

        /* ****Filtering (where price=100)(where name=this this) *** */
        //query = Tour.find(JSON.parse(querystr));

        /* ****Sorting (sort by name acending or decending) *** */
        //query = query.sort(req.query.sort);

        /* ****Limiting (select name)(select name,price,etc...)  *** */
        //const field = req.query.fields.split(',').join(' ');
        //query = query.select(field);

        /* **** Pagination *** */
        //query = query.skip(5).limit(5);


        const gettour = await query;
        res.status(200).json({
            staus: "success",

            tour: gettour

        })
    } catch (err) {
        res.status(400).json({
            staus: "fail",
            message: "invalid data" + err
        })
    }
}

exports.posttour = catchasync(async (req, res) => {
    //try {
    req.body.createdby = req.user.id;
    console.log(req.body);
    const newtour = await Tour.create(req.body);
    res.status(200).json({
        staus: "success",
        data: {
            tour: newtour
        }
    })
    // } catch (err) {
    res.status(400).json({
        staus: "fail",
        message: "invalid data" + err
    })
    //   }
});
// const insrt = new tour({
//     name: 'may name is this one'
// });

// insrt.save()
//     .then(doc => {
//         console.log(doc);
//     }).catch(err => {
//         console.log('ERROR', err);
//     })
// const nt = Object.assign(req.body)
// tours.push(nt);
// fs.writeFile(`${__dirname}/data/tour.json`, JSON.stringify(tours), err => {
//     console.log(req.body);
//     res.send('done');
// })


exports.gett = async (req, res, next) => {
    try {

        /* find by ID */
        //const get1tour = await Tour.findById(req.params.abc);
        // const getmath = await Tour.aggregate([
        //     {
        //         $unwind: '$startdate',

        //     },
        //     {
        //         $match: {
        //             startdate: {
        //                 $gte: new Date('2021-01-01'),
        //                 $lte: new Date('2021-12-30')
        //             },
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: { $month: '$startdate' },
        //             numtour: { $sum: 1 },
        //             tourname: { $push: '$name' }
        //         }
        //     },
        //     {
        //         $addFields: { month: '$_id' }
        //     },
        //     {
        //         $project: { _id: 0 }
        //     },
        //     {
        //         $sort: {
        //             numtour: -1
        //         }
        //     }

        // {
        //     $group: {
        //         _id: '$name',
        //         count: { $sum: 1 },
        //         price: { $sum: '$price' },
        //         maxprice: { $max: '$price' }
        //     }
        // },
        // {
        //     $sort: { maxprice: -1 }
        // },
        // {
        //     $match: { _id: { $ne: 'name from api' } }
        // }

        // ])
        /* Remove by ID */
        let query;
        if (req.user.role === "user") query = await Tour.findOneAndRemove({ _id: req.params.id, createdby: req.user.id })
        // console.log(query);
        if (req.user.role === "admin") query = await Tour.findByIdAndRemove(req.params.id);
        if (!query) {
            return next(new Error("not created by you"))
        }
        // const get1tour = await query;

        /* Update by ID */
        // const get1tour = await Tour.findByIdAndUpdate(req.params.abc, req.body, {
        //     new: true,
        //     runValidators: true
        // });
        // const get1tour = await Tour.updateMany({ price: 100 }, req.body, {
        //     new: true,
        //     runValidators: true
        // });

        res.status(200).json({
            staus: "success",
            data: {
                tour: query
            }
        })
    } catch (err) {
        res.status(400).json({
            staus: "fail",
            message: "invalid data" + err
        })
    }
}
