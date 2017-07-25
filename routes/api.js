let express = require('express');
let router = express.Router();
let formidable = require('formidable');

let Report = require('../src/report');
let Report_Settings = require('../src/settings/report');
let Project_Settings = require('../src/settings/project');
let Release_Settings = require('../src/settings/release');
let processReportUpload = require('../src/processReportUpload');

//Reports
router.get('/reports/', function (request, response) {
    let result = new Report().findAll((err, results) => {
        if (err) {
            console.error(err);
            response.send(err);
            return;
        }
        response.send(results);
    })
});

router.get('/report/:id', function (request, response) {
    let result = new Report(request.params.id).delete((err, results) => {
        if (err) {
            console.error(err);
            response.send(err);
            return;
        }
        response.send(results);
    })
});

router.post('/report', function (request, response) {
    processReportUpload(request, (err) => {
        if (err) {
            console.error(err);
            response.send({ success: false });
            return;
        }
        response.send({ success: true });
    });
});

router.delete('/report/:id', function (request, response) {
    let result = new Report(request.params.id).delete((err, results) => {
        if (err) {
            console.error(err);
            response.send(err);
            return;
        }
        response.send(results);
    })
});

router.put('/report/:id', function (request, response) {
    response.send('Not Implemented Update ' + request.params.id);
});

//Report Settings
router.post('/settings/report', function (request, response) {
    let fields = {};

    let form = new formidable.IncomingForm().parse(request);
    form.on('field', (name, field) => {
        fields[name] = field;
    });

    form.on('end', () => {
        let report_settings = new Report_Settings(null, fields.name, fields.passXpath, fields.failXpath, fields.skippedXpath, fields.summaryFile, fields.indexFile);

        report_settings.create((err, results) => {
            if (err) {
                console.error(err)
                response.send(err);
                return;
            }
            response.send({'success': true, 'id': results.insertId});
        })
    })

});

router.get('/settings/report', function (request, response) {
    let report_settings = new Report_Settings();
    report_settings.findAll((err, results) => {
        if (err) {
                console.error(err)
                response.send(err);
                return;
            }
        response.send(results);
    })
})


router.delete('/settings/report/:id', function (request, response) {
    let result = new Report_Settings(request.params.id).delete((err, results) => {
        if (err) {
            console.error(err);
            response.send(err);
            return;
        }
        response.send(results);
    })
});

//Release Setting
router.post('/settings/release', function (request, response) {
    let fields = {};

    let form = new formidable.IncomingForm().parse(request);
    form.on('field', (name, field) => {
        fields[name] = field;
    });

    form.on('end', () => {
        let report_settings = new Release_Settings(null, fields.name);

        report_settings.create((err, results) => {
            if (err) {
                console.error(err)
                response.send(err);
                return;
            }
            response.send({'success': true, 'id': results.insertId});
        })
    })

});

router.get('/settings/release', function (request, response) {
    let report_settings = new Release_Settings();
    report_settings.findAll((err, results) => {
        if (err) {
                console.error(err)
                response.send(err);
                return;
            }
        response.send(results);
    })
})

router.delete('/settings/release/:id', function (request, response) {
    let result = new Release_Settings(request.params.id).delete((err, results) => {
        if (err) {
            console.error(err);
            response.send(err);
            return;
        }
        response.send(results);
    })
});

//Project Setting
router.post('/settings/project', function (request, response) {
    let fields = {};

    let form = new formidable.IncomingForm().parse(request);
    form.on('field', (name, field) => {
        fields[name] = field;
    });

    form.on('end', () => {
        let report_settings = new Project_Settings(null, fields.name, fields.release);

        report_settings.create((err, results) => {
            if (err) {
                console.error(err)
                response.send(err);
                return;
            }
            response.send({'success': true, 'id': results.insertId});
        })
    })

});

router.get('/settings/project', function (request, response) {
    let report_settings = new Project_Settings();
    report_settings.findAll((err, results) => {
        if (err) {
                console.error(err)
                response.send(err);
                return;
            }
        response.send(results);
    })
})

router.delete('/settings/project/:id', function (request, response) {
    let result = new Project_Settings(request.params.id).delete((err, results) => {
        if (err) {
            console.error(err);
            response.send(err);
            return;
        }
        response.send(results);
    })
});

//Metrics
router.get('/metrics', function (request, response) {
    response.send('Not Implemented Dashboard');
});

module.exports = router;