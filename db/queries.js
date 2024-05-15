const rx = require('../utils/read_excel');
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'mixa',
    host: '127.0.0.1',
    database: 'NastyaDiplom',
    password: '12345',
    port: 5432
});
exports.getPool = () => pool;

const getDtpChart = (request, response) => {

    let region_code = request.query.region_code;
    let start_date = request.query.start_date;
    let end_date = request.query.end_date;
    let victim = request.query.victim;
    let factor_dtp_id = request.query.factor_dtp_id;

    if (start_date === undefined || end_date === undefined) {
        end_date = Date.now();
        start_date = new Date(Date.now() - 604800000).toISOString();
        end_date = new Date(Date.now()).toISOString();

        start_date = '2022-01-01 00:00:00';
        end_date = '2022-01-14 00:00:00';
    }

    if (victim === undefined) {
        victim = '0';
    }

    let factor_dtp_additional = '';
    if (factor_dtp_id !== undefined) {
        factor_dtp_additional += 'and id in (select card_id from factor_ref where factor_id in (' + factor_dtp_id + '))';
    }


    // console.log("region_code: "+region_code);
    // console.log("start_date: "+start_date);
    // console.log("end_date: "+end_date);

    let victim_addtitional = '';
    if (victim === '0') { //all

    } else if (victim === '1') { //no injured
        victim_addtitional = 'and pog = 0 and ran = 0 ';
    } else if (victim === '2') { // injured but alive
        victim_addtitional = 'and pog = 0 and ran > 0 ';
    } else if (victim === '3') { // letal
        victim_addtitional = 'and pog > 0 ';
    }


    let query;
    if (region_code === undefined) {

        query = 'SELECT CAST(date As Date) as xCoords, COUNT(id) as yCoords  \n' +
            '\tFROM public."DTPCard"\n' +
            'where region_id in (select id from public."Regions")  ' + factor_dtp_additional + ' ' + victim_addtitional + 'and date between \'' + start_date + '\' and \'' + end_date + '\'\n ';
    } else {
        query = 'SELECT CAST(date As Date) as xCoords, COUNT(id) as yCoords  \n' +
            '\tFROM public."DTPCard"\n' +
            'where region_id in (' + region_code + ')  ' + factor_dtp_additional + ' ' + victim_addtitional + ' and date between \'' + start_date + '\' and \'' + end_date + '\'\n ';

    }


    query += 'GROUP BY CAST(date As Date) order by xcoords;';

    console.log(query);


    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }

        let result = {
            isSuccess: true,
            message: "?",
            data: {
                coords: results.rows
            }
        };

        response.status(200).json(result);
    });
};

const getAnalysisFactorChart = (request, response) => {

    let analysis_factor_id = request.query.analysis_factor_id;
    let start_date = request.query.start_date;
    let end_date = request.query.end_date;


    if (analysis_factor_id === undefined) {
        // let result = {
        //     isSuccess: false,
        //     message: "Can't create query! Need " + 'analysis_factor_id parameter',
        // };
        // response.status(500).json(result);
        analysis_factor_id = 4;
    }
    if (start_date === undefined || end_date === undefined) {

        start_date = '2022-01-01 00:00:00';
        end_date = '2022-01-14 00:00:00';
    }

    let query = 'select xcoords, avg(ycoords) as ycoords from' +
        '(SELECT CAST(date as Date) as xCoords, origin_value as yCoords  \n' +
        '\tFROM public."factor_data"\n' +
        'where analysis_factor_id in (' + analysis_factor_id + ')  and date between \'' + start_date + '\' and \'' + end_date + '\'\n) as foo ' +
        'group by xcoords order by xcoords;'

    console.error(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }

        let result = {
            isSuccess: true,
            message: "???",
            data: {
                coords: results.rows
            }
        };

        response.status(200).json(result);
    });
    /*}*/
};

const getAnalysisFactorChartStub = (request, response) => {

    let result =
        {
            "isSuccess": true,
            "message": "???",
            "data": {
                "coords": [{
                    "xcoords": "2021-12-31T21:00:00.000Z",
                    "ycoords": 5
                }, {"xcoords": "2022-01-01T21:00:00.000Z", "ycoords": 7}, {
                    "xcoords": "2022-01-02T21:00:00.000Z",
                    "ycoords": 3
                }, {"xcoords": "2022-01-03T21:00:00.000Z", "ycoords": 1}, {
                    "xcoords": "2022-01-04T21:00:00.000Z",
                    "ycoords": 8
                }]
            }
        };
    response.status(200).json(result);
};

const getDtpChartStub = (request, response) => {

    let result =
        {
            "isSuccess": true, "message": "", "data": {
                "coords": [{
                    "xcoords": "2021-12-31T21:00:00.000Z",
                    "ycoords": "20"
                }, {"xcoords": "2022-01-01T21:00:00.000Z", "ycoords": "17"}, {
                    "xcoords": "2022-01-02T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-01-03T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-01-04T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-01-05T21:00:00.000Z", "ycoords": "15"}, {
                    "xcoords": "2022-01-06T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-01-07T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-01-08T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-01-09T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-01-10T21:00:00.000Z",
                    "ycoords": "15"
                }, {"xcoords": "2022-01-11T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-01-12T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-01-13T21:00:00.000Z", "ycoords": "19"}, {
                    "xcoords": "2022-01-14T21:00:00.000Z",
                    "ycoords": "17"
                }, {"xcoords": "2022-01-15T21:00:00.000Z", "ycoords": "15"}, {
                    "xcoords": "2022-01-16T21:00:00.000Z",
                    "ycoords": "14"
                }, {"xcoords": "2022-01-17T21:00:00.000Z", "ycoords": "17"}, {
                    "xcoords": "2022-01-18T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-01-19T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-01-20T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-01-21T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-01-22T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-01-23T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-01-24T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-01-25T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-01-26T21:00:00.000Z",
                    "ycoords": "4"
                }, {"xcoords": "2022-01-27T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-01-28T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-01-29T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-01-30T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-01-31T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-02-01T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-02-02T21:00:00.000Z", "ycoords": "9"}, {
                    "xcoords": "2022-02-03T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-02-04T21:00:00.000Z", "ycoords": "12"}, {
                    "xcoords": "2022-02-05T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-02-06T21:00:00.000Z", "ycoords": "5"}, {
                    "xcoords": "2022-02-07T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-02-08T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-02-09T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-02-10T21:00:00.000Z", "ycoords": "11"}, {
                    "xcoords": "2022-02-11T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-02-12T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-02-13T21:00:00.000Z",
                    "ycoords": "4"
                }, {"xcoords": "2022-02-14T21:00:00.000Z", "ycoords": "3"}, {
                    "xcoords": "2022-02-15T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-02-16T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-02-17T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-02-18T21:00:00.000Z", "ycoords": "12"}, {
                    "xcoords": "2022-02-19T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-02-20T21:00:00.000Z", "ycoords": "5"}, {
                    "xcoords": "2022-02-21T21:00:00.000Z",
                    "ycoords": "5"
                }, {"xcoords": "2022-02-22T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-02-23T21:00:00.000Z",
                    "ycoords": "6"
                }, {"xcoords": "2022-02-24T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-02-25T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-02-26T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-02-27T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-02-28T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-03-01T21:00:00.000Z",
                    "ycoords": "9"
                }, {"xcoords": "2022-03-02T21:00:00.000Z", "ycoords": "9"}, {
                    "xcoords": "2022-03-03T21:00:00.000Z",
                    "ycoords": "11"
                }, {"xcoords": "2022-03-04T21:00:00.000Z", "ycoords": "4"}, {
                    "xcoords": "2022-03-05T21:00:00.000Z",
                    "ycoords": "3"
                }, {"xcoords": "2022-03-06T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-03-07T21:00:00.000Z",
                    "ycoords": "4"
                }, {"xcoords": "2022-03-08T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-03-09T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-03-10T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-03-11T21:00:00.000Z",
                    "ycoords": "5"
                }, {"xcoords": "2022-03-12T21:00:00.000Z", "ycoords": "5"}, {
                    "xcoords": "2022-03-13T21:00:00.000Z",
                    "ycoords": "10"
                }, {"xcoords": "2022-03-14T21:00:00.000Z", "ycoords": "9"}, {
                    "xcoords": "2022-03-15T21:00:00.000Z",
                    "ycoords": "10"
                }, {"xcoords": "2022-03-16T21:00:00.000Z", "ycoords": "10"}, {
                    "xcoords": "2022-03-17T21:00:00.000Z",
                    "ycoords": "12"
                }, {"xcoords": "2022-03-18T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-03-19T21:00:00.000Z",
                    "ycoords": "5"
                }, {"xcoords": "2022-03-20T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-03-21T21:00:00.000Z",
                    "ycoords": "10"
                }, {"xcoords": "2022-03-22T21:00:00.000Z", "ycoords": "13"}, {
                    "xcoords": "2022-03-23T21:00:00.000Z",
                    "ycoords": "8"
                }, {"xcoords": "2022-03-24T21:00:00.000Z", "ycoords": "6"}, {
                    "xcoords": "2022-03-25T21:00:00.000Z",
                    "ycoords": "13"
                }, {"xcoords": "2022-03-26T21:00:00.000Z", "ycoords": "19"}, {
                    "xcoords": "2022-03-27T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-03-28T21:00:00.000Z", "ycoords": "8"}, {
                    "xcoords": "2022-03-29T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-03-30T21:00:00.000Z", "ycoords": "7"}, {
                    "xcoords": "2022-03-31T21:00:00.000Z",
                    "ycoords": "7"
                }, {"xcoords": "2022-04-01T21:00:00.000Z", "ycoords": "13"}]
            }
        };
    response.status(200).json(result);
};


const getVersion = (request, response) => {
    pool.query('SELECT version()', (error, results) => {
        if (error) {
            throw error;
        }
        //console.log(results.rows);
        response.status(200).json(results.rows);
    });
};
const getRegions = (request, response) => {
    pool.query('SELECT * FROM public."Regions" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const getFactorList = (request, response) => {
    pool.query('SELECT * FROM public."factor" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};
const getAnalysisFactorList = (request, response) => {
    pool.query('SELECT * FROM public."analysis_factors" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const getAnalysisFactor = (request, response) => {
    const {id} = request.params;

    let query = 'SELECT * FROM public."analysis_factors" where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const getAnalysisFactorStub = (request, response) => {
    let result =
        {
            "isSuccess": true,
            "message": "",
            "data": [{
                "id": 1,
                "name": "Первый фактор",
                "analysis_method_id": 0,
                "created_at": "2021-12-31T21:00:00.000Z",
                "updated_at": "2021-12-31T21:00:00.000Z",
                "deleted_at": null,
                "data_file_path": "somepath"
            }]
        };
    response.status(200).json(result);
};

const createAnalysisFactor = (request, response) => {
    const factor = request.body;

    let name = factor.name;

    if (name === undefined || name === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter name is wrong",
        };
        response.status(300).json(result);
    } else {
        let query = 'INSERT INTO public.analysis_factors(name, created_at, updated_at) ' +
            '\tVALUES (\'' + name + '\', CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);';
        console.log(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error;
            }
            let result = {
                isSuccess: true,
                message: "",
                data: results.rows
            };

            response.status(200).json(result);
        });
    }
};

const createAnalysisFactorStub = (request, response) => {
    const factor = request.body;

    let name = factor.name;

    if (name === undefined || name === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter name is wrong",
        };
        response.status(300).json(result);
    } else {

        let result = {
            isSuccess: true,
            message: "test ok",
        };

        response.status(200).json(result);
    }
};

const deleteAnalysisFactor = (request, response) => {
    const {id} = request.params;

    let query = 'DELETE FROM public."analysis_factors" where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const deleteAnalysisFactorStub = (request, response) => {
    const {id} = request.params;

    let result = {
        isSuccess: true,
        message: "Test delete ok"
    };

    response.status(200).json(result);

};

const updateAnalysisFactor = (request, response) => {
    const {id} = request.params;

    const factor = request.body;
    let name = factor.name;
    let analysis_method_id = factor.analysis_method_id;
    let data_file_path = factor.data_file_path;

    let query = 'UPDATE public.analysis_factors\n' +
        'SET updated_at=CURRENT_TIMESTAMP,\n';

    if (id === undefined || id === '') {
        let result = {
            isSuccess: true,
            message: "Wrong parameter id!",
        };
        response.status(300).json(result);
        return;
    }

    let additional = '';

    if (name !== undefined) {
        additional += 'name=\'' + name + '\',';
    }

    if (analysis_method_id !== undefined) {
        additional += 'analysis_method_id=\'' + analysis_method_id + '\',';
    }

    if (data_file_path !== undefined) {
        additional += 'data_file_path=\'' + data_file_path + '\',';
    }

    if (additional.toString().endsWith(',')) {
        additional = additional.substring(0, additional.length - 1);
    }

    query += additional;
    query += '\t where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const updateAnalysisFactorStub = (request, response) => {
    const {id} = request.params;

    if (id === undefined || id === '') {
        let result = {
            isSuccess: true,
            message: "Wrong parameter id!",
        };
        response.status(300).json(result);
        return;
    }

    let result = {
        isSuccess: true,
        message: ""
    };

    response.status(200).json(result);

};

const getAnalysisFactorListStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [{
            "id": 1,
            "name": "Первый фактор",
            "analysis_method_id": 0,
            "created_at": "2021-12-31T21:00:00.000Z",
            "updated_at": "2021-12-31T21:00:00.000Z",
            "deleted_at": null,
            "data_file_path": "somepath"
        }, {
            "id": 2,
            "name": "Второй фактор",
            "analysis_method_id": 0,
            "created_at": "2021-12-31T21:00:00.000Z",
            "updated_at": "2021-12-31T21:00:00.000Z",
            "deleted_at": null,
            "data_file_path": "somepath"
        }, {
            "id": 3,
            "name": "Третий фактор",
            "analysis_method_id": 0,
            "created_at": "2021-12-31T21:00:00.000Z",
            "updated_at": "2021-12-31T21:00:00.000Z",
            "deleted_at": null,
            "data_file_path": "somepath"
        }]
    };
    response.status(200).json(result);
};

const getFactorListStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [{
            "id": 1837,
            "title": "Оказание влияния на движение транспортного потока или отдельного транспортного средства, наличия или внезапного появления на проезжей части животных",
            "created_at": "2024-04-21T15:21:13.266Z",
            "updated_at": "2024-04-21T15:21:13.266Z",
            "deleted_at": null
        }, {
            "id": 1838,
            "title": "Сужение проезжей части вследствие проведения работ",
            "created_at": "2024-04-21T15:21:13.267Z",
            "updated_at": "2024-04-21T15:21:13.267Z",
            "deleted_at": null
        }, {
            "id": 1839,
            "title": "Участок, оборудованный искусственными неровностями",
            "created_at": "2024-04-21T15:21:13.267Z",
            "updated_at": "2024-04-21T15:21:13.267Z",
            "deleted_at": null
        }, {
            "id": 1840,
            "title": "Наличие на проезжей части неисправного ТС, мешающего движению",
            "created_at": "2024-04-21T15:21:13.268Z",
            "updated_at": "2024-04-21T15:21:13.268Z",
            "deleted_at": null
        }, {
            "id": 1841,
            "title": "Несоответствие габарита моста (путепровода) ширине проезжей части  на подходах к нему",
            "created_at": "2024-04-21T15:21:13.268Z",
            "updated_at": "2024-04-21T15:21:13.268Z",
            "deleted_at": null
        }, {
            "id": 1842,
            "title": "Режим движения изменён вследствие проведения спецмероприятия",
            "created_at": "2024-04-21T15:21:13.269Z",
            "updated_at": "2024-04-21T15:21:13.269Z",
            "deleted_at": null
        }, {
            "id": 1843,
            "title": "Режим движения нарушен вследствие ранее произошедшего ДТП",
            "created_at": "2024-04-21T15:21:13.269Z",
            "updated_at": "2024-04-21T15:21:13.269Z",
            "deleted_at": null
        }, {
            "id": 1844,
            "title": "Несоответствие параметров дороги, в т.ч. геометрических, её категории на месте ДТП или на подходах к нему (величина радиуса поворота, ширина полос движения, обочин, крутизна откосов насыпи, отсутствие разделительной полосы, отсутствие виража и т.д.)",
            "created_at": "2024-04-21T15:21:13.270Z",
            "updated_at": "2024-04-21T15:21:13.270Z",
            "deleted_at": null
        }, {
            "id": 1845,
            "title": "Проведение работ на тротуарах (пешеходных дорожках, обочинах),  затрудняющих движение пешеходов",
            "created_at": "2024-04-21T15:21:13.270Z",
            "updated_at": "2024-04-21T15:21:13.270Z",
            "deleted_at": null
        }, {
            "id": 1846,
            "title": "Конструктивное сужение проезжей части вследствие уменьшения количества полос движения",
            "created_at": "2024-04-21T15:21:13.271Z",
            "updated_at": "2024-04-21T15:21:13.271Z",
            "deleted_at": null
        }, {
            "id": 1847,
            "title": "Участок, оборудованный шумовыми полосами",
            "created_at": "2024-04-21T15:21:13.272Z",
            "updated_at": "2024-04-21T15:21:13.272Z",
            "deleted_at": null
        }, {
            "id": 1848,
            "title": "Сужение проезжей части припаркованным транспортом",
            "created_at": "2024-04-21T15:21:13.272Z",
            "updated_at": "2024-04-21T15:21:13.272Z",
            "deleted_at": null
        }, {
            "id": 1849,
            "title": "Проведение дорожных и прочих работ без сужения проезжей части",
            "created_at": "2024-04-21T15:21:13.272Z",
            "updated_at": "2024-04-21T15:21:13.272Z",
            "deleted_at": null
        }, {
            "id": 1850,
            "title": "Участок, контролируемый стационарными камерами автоматической фотовидеофиксации нарушений ПДД, обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-21T15:21:13.273Z",
            "updated_at": "2024-04-21T15:21:13.273Z",
            "deleted_at": null
        }, {
            "id": 1851,
            "title": "Участок, контролируемый стационарными камерами автоматической фотовидеофиксации нарушений ПДД, не обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-21T15:21:13.273Z",
            "updated_at": "2024-04-21T15:21:13.273Z",
            "deleted_at": null
        }, {
            "id": 1852,
            "title": "Наличие на проезжей части, обочине или тротуаре торгового или иного объекта, затрудняющего движение или парковку транспорта и (или) движение пешеходов",
            "created_at": "2024-04-21T15:21:13.274Z",
            "updated_at": "2024-04-21T15:21:13.274Z",
            "deleted_at": null
        }, {
            "id": 1853,
            "title": "Работа светофора на регулируемом перекрёстке или регулируемом пешеходном переходе в режиме 'жёлтого мигания'",
            "created_at": "2024-04-21T15:21:13.274Z",
            "updated_at": "2024-04-21T15:21:13.274Z",
            "deleted_at": null
        }, {
            "id": 1854,
            "title": "Оказание влияния на движение транспортного потока или отдельного транспортного средства, наличия или внезапного возникновения на проезжей части посторонних предметов (упавшее дерево или мачта освещения, осыпь камней, селевой вынос, груз с другого транспортного сред-ства или конструктивный элемент другого транспортного средства и т.д.)",
            "created_at": "2024-04-21T15:21:13.275Z",
            "updated_at": "2024-04-21T15:21:13.275Z",
            "deleted_at": null
        }, {
            "id": 1855,
            "title": "Изменение в режиме движения вследствие согласованного массового мероприятия",
            "created_at": "2024-04-21T15:21:13.275Z",
            "updated_at": "2024-04-21T15:21:13.275Z",
            "deleted_at": null
        }, {
            "id": 1856,
            "title": "Несоответствие категории дороги (фактических геометрических характеристик) интенсивности движения (исходя из требований СП 34.13330.2012 «Свод правил. Автомобильные дороги. Актуализированная редакция СНиП 2.05.02-85*»)",
            "created_at": "2024-04-21T15:21:13.275Z",
            "updated_at": "2024-04-21T15:21:13.275Z",
            "deleted_at": null
        }, {
            "id": 1857,
            "title": "Наличие на тротуарах (пешеходных дорожках, обочинах) припаркованного  транспорта,   затрудняющего движение пешеходов",
            "created_at": "2024-04-21T15:21:13.276Z",
            "updated_at": "2024-04-21T15:21:13.276Z",
            "deleted_at": null
        }, {
            "id": 1858,
            "title": "Сведения отсутствуют",
            "created_at": "2024-04-21T15:21:13.276Z",
            "updated_at": "2024-04-21T15:21:13.276Z",
            "deleted_at": null
        }, {
            "id": 1859,
            "title": "Неудовлетворительное состояние тротуара или пешеходной дорожки (в  т.ч. недостатки зимнего содержания), затрудняющие или препятствующие движению пешеходов",
            "created_at": "2024-04-21T15:21:13.276Z",
            "updated_at": "2024-04-21T15:21:13.276Z",
            "deleted_at": null
        }, {
            "id": 1886,
            "title": "Нарушение режима движения вследствие несогласованного массового мероприятия",
            "created_at": "2024-04-21T16:37:42.882Z",
            "updated_at": "2024-04-21T16:37:42.882Z",
            "deleted_at": null
        }, {
            "id": 1936,
            "title": "Отключение электроснабжения целиком или частично в муниципальном образовании (районе, городе, районе города, посёлке, селе, деревне, ауле и т.д.)",
            "created_at": "2024-04-22T09:18:39.074Z",
            "updated_at": "2024-04-22T09:18:39.074Z",
            "deleted_at": null
        }, {
            "id": 1940,
            "title": "Наличие пересечения (примыкания), не предусмотренного проектной документацией» (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.075Z",
            "updated_at": "2024-04-22T09:18:39.075Z",
            "deleted_at": null
        }, {
            "id": 1942,
            "title": "Отключение электроснабжения на данном элементе УДС (улице, дороге, площади, дворе и т.д.) в целом (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.075Z",
            "updated_at": "2024-04-22T09:18:39.075Z",
            "deleted_at": null
        }, {
            "id": 1945,
            "title": "Участок, оборудованный искусственными неровностями, не обозначенный соответствующими дорожными знаками и(или) разметкой (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.076Z",
            "updated_at": "2024-04-22T09:18:39.076Z",
            "deleted_at": null
        }, {
            "id": 1954,
            "title": "Отсутствие дополнительных полос для движения (в т.ч. переходно-скоростных полос) в необходимых местах (не применяется с 12.2020)",
            "created_at": "2024-04-22T09:18:39.077Z",
            "updated_at": "2024-04-22T09:18:39.077Z",
            "deleted_at": null
        }, {
            "id": 1958,
            "title": "Отключение электроснабжения на данном элементе УДС (улице, дороге, площади, дворе и т.д.) в целом",
            "created_at": "2024-04-22T11:22:28.486Z",
            "updated_at": "2024-04-22T11:22:28.486Z",
            "deleted_at": null
        }, {
            "id": 1961,
            "title": "Наличие  пересечения (примыкания), не предусмотренного проектной документацией",
            "created_at": "2024-04-22T11:22:28.490Z",
            "updated_at": "2024-04-22T11:22:28.490Z",
            "deleted_at": null
        }, {
            "id": 1962,
            "title": "Участок, оборудованный искусственными неровностями и обозначенный соответствующими дорожными знаками и разметкой",
            "created_at": "2024-04-22T11:22:28.491Z",
            "updated_at": "2024-04-22T11:22:28.491Z",
            "deleted_at": null
        }, {
            "id": 1966,
            "title": "Участок, оборудованный искусственными неровностями, не обозначенный соответствующими дорожными знаками и (или) разметкой",
            "created_at": "2024-04-22T11:22:28.496Z",
            "updated_at": "2024-04-22T11:22:28.496Z",
            "deleted_at": null
        }, {
            "id": 1969,
            "title": "Отсутствие дополнительных полос для движения (в т.ч. переходно-скоростных полос) в необходимых местах",
            "created_at": "2024-04-22T11:22:28.499Z",
            "updated_at": "2024-04-22T11:22:28.499Z",
            "deleted_at": null
        }, {
            "id": 1974,
            "title": "Участок, контролируемый камерой автоматической фотовидеофиксации нарушений ПДД, обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-22T11:22:28.504Z",
            "updated_at": "2024-04-22T11:22:28.504Z",
            "deleted_at": null
        }, {
            "id": 1979,
            "title": "Несоответствие категории дороги (фактических геометрических характеристик) интенсивности движения (исходя из требований СНиП 2.05.02.-85 'Автомобильные дороги')",
            "created_at": "2024-04-22T11:22:28.509Z",
            "updated_at": "2024-04-22T11:22:28.509Z",
            "deleted_at": null
        }, {
            "id": 1980,
            "title": "Участок, контролируемый камерой автоматической фотовидеофиксации нарушений ПДД, не обозначенный соответствующим предупреждающим знаком",
            "created_at": "2024-04-22T11:22:28.511Z",
            "updated_at": "2024-04-22T11:22:28.511Z",
            "deleted_at": null
        }, {
            "id": 1981,
            "title": "Отключение электроснабжения целиком или частично в муниципальном образовании  (районе, городе, районе  города, посёлке, селе, деревне, ауле и т.д.)",
            "created_at": "2024-04-22T11:22:28.512Z",
            "updated_at": "2024-04-22T11:22:28.512Z",
            "deleted_at": null
        }]
    };
    response.status(200).json(result);
};

///
const getAnalysisMethod = (request, response) => {
    const {id} = request.params;

    let query = 'SELECT * FROM public."analysis_methods" where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};
const getAnalysisMethodStub = (request, response) => {
    let result =
        {
            "isSuccess": true,
            "message": "",
            "data": [
                {
                    "id": 0,
                    "name": "первая формула",
                    "formula": "a*b*c",
                    "created_at": "2024-05-08T13:03:12.114Z",
                    "updated_at": "2024-05-08T13:03:57.448Z",
                    "deleted_at": null
                }
            ]
        };
    response.status(200).json(result);
};

const createAnalysisMethod = (request, response) => {
    const method = request.body;

    let name = method.name;
    let formula = method.formula;

    if (name === undefined || name === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter name is wrong",
        };
        response.status(300).json(result);
    } else if (formula === undefined || formula === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter formula is wrong",
        };
        response.status(300).json(result);
    } else {
        let query = 'INSERT INTO public.analysis_methods(name, formula, created_at, updated_at) ' +
            '\tVALUES (\'' + name + '\', \'' + formula + '\',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);';
        console.log(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error;
            }
            let result = {
                isSuccess: true,
                message: "",
                data: results.rows
            };

            response.status(200).json(result);
        });
    }
};

const createAnalysisMethodStub = (request, response) => {
    const factor = request.body;

    let name = factor.name;
    let formula = factor.formula;

    if (name === undefined || name === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter name is wrong",
        };
        response.status(300).json(result);
    } else if (formula === undefined || formula === '') {
        let result = {
            isSuccess: false,
            message: "Body parameter formula is wrong",
        };
        response.status(300).json(result);
    } else {

        let result = {
            isSuccess: true,
            message: "test ok",
        };

        response.status(200).json(result);
    }
};

const deleteAnalysisMethod = (request, response) => {
    const {id} = request.params;

    let query = 'DELETE FROM public."analysis_methods" where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const deleteFactorDataStub = (request, response) => {

    let result =
        {"isSuccess": true, "message": "", "data": []};

    response.status(200).json(result);
};

const deleteFactorData = (request, response) => {
    const {id} = request.params;

    let query = 'DELETE FROM public."factor_data" where analysis_factor_id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const deleteAnalysisMethodStub = (request, response) => {
    const {id} = request.params;

    let result = {
        isSuccess: true,
        message: "Test delete ok"
    };

    response.status(200).json(result);

};

const updateAnalysisMethod = (request, response) => {
    const {id} = request.params;

    const factor = request.body;
    let name = factor.name;
    let formula = factor.formula;

    let query = 'UPDATE public.analysis_methods\n' +
        'SET updated_at=CURRENT_TIMESTAMP,\n';

    if (id === undefined || id === '') {
        let result = {
            isSuccess: true,
            message: "Wrong parameter id!",
        };
        response.status(300).json(result);
        return;
    }

    let additional = '';

    if (name !== undefined) {
        additional += 'name=\'' + name + '\',';
    }

    if (formula !== undefined) {
        additional += 'formula=\'' + formula + '\',';
    }


    if (additional.toString().endsWith(',')) {
        additional = additional.substring(0, additional.length - 1);
    }

    query += additional;
    query += '\t where id =' + id;
    console.log(query);

    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};

const updateAnalysisMethodStub = (request, response) => {
    const {id} = request.params;

    if (id === undefined || id === '') {
        let result = {
            isSuccess: true,
            message: "Wrong parameter id!",
        };
        response.status(300).json(result);
        return;
    }

    let result = {
        isSuccess: true,
        message: ""
    };

    response.status(200).json(result);

};

const getAnalysisMethodListStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [
            {
                "id": 0,
                "name": "первая формула",
                "formula": "a*b*c",
                "created_at": "2024-05-08T13:03:12.114Z",
                "updated_at": "2024-05-08T13:03:57.448Z",
                "deleted_at": null
            },
            {
                "id": 1,
                "name": "вторая формула",
                "formula": "a*b",
                "created_at": "2024-05-08T13:05:19.755Z",
                "updated_at": "2024-05-08T13:05:19.755Z",
                "deleted_at": null
            }
        ]
    };
    response.status(200).json(result);
};

const getAnalysisMethodList = (request, response) => {
    pool.query('SELECT * FROM public."analysis_methods" ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        let result = {
            isSuccess: true,
            message: "",
            data: results.rows
        };

        response.status(200).json(result);
    });
};
///
const getRegionsStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [{
            "id": 3501333,
            "region_code": 80,
            "region_name": "Республика Башкортостан",
            "created_at": "2024-04-21T15:21:16.467Z",
            "updated_at": "2024-04-21T15:21:16.467Z",
            "deleted_at": null
        }, {
            "id": 3504950,
            "region_code": 27,
            "region_name": "Калининградская область",
            "created_at": "2024-04-21T15:21:16.624Z",
            "updated_at": "2024-04-21T15:21:16.624Z",
            "deleted_at": null
        }, {
            "id": 3505951,
            "region_code": 17,
            "region_name": "Владимирская область",
            "created_at": "2024-04-21T15:21:16.665Z",
            "updated_at": "2024-04-21T15:21:16.665Z",
            "deleted_at": null
        }, {
            "id": 3507692,
            "region_code": 36,
            "region_name": "Самарская область",
            "created_at": "2024-04-21T15:21:16.744Z",
            "updated_at": "2024-04-21T15:21:16.744Z",
            "deleted_at": null
        }, {
            "id": 3510725,
            "region_code": 91,
            "region_name": "Карачаево-Черкесская Республика",
            "created_at": "2024-04-21T15:21:16.881Z",
            "updated_at": "2024-04-21T15:21:16.881Z",
            "deleted_at": null
        }, {
            "id": 3511138,
            "region_code": 57,
            "region_name": "Пермский край",
            "created_at": "2024-04-21T15:21:16.898Z",
            "updated_at": "2024-04-21T15:21:16.898Z",
            "deleted_at": null
        }, {
            "id": 3513194,
            "region_code": 20,
            "region_name": "Воронежская область",
            "created_at": "2024-04-21T15:21:16.992Z",
            "updated_at": "2024-04-21T15:21:16.992Z",
            "deleted_at": null
        }, {
            "id": 3515751,
            "region_code": 40,
            "region_name": "г. Санкт-Петербург",
            "created_at": "2024-04-21T15:21:17.114Z",
            "updated_at": "2024-04-21T15:21:17.114Z",
            "deleted_at": null
        }, {
            "id": 3519774,
            "region_code": 76,
            "region_name": "Забайкальский край",
            "created_at": "2024-04-21T15:21:17.287Z",
            "updated_at": "2024-04-21T15:21:17.287Z",
            "deleted_at": null
        }, {
            "id": 3520746,
            "region_code": 61,
            "region_name": "Рязанская область",
            "created_at": "2024-04-21T15:21:17.324Z",
            "updated_at": "2024-04-21T15:21:17.324Z",
            "deleted_at": null
        }, {
            "id": 3522243,
            "region_code": 68,
            "region_name": "Тамбовская область",
            "created_at": "2024-04-21T15:21:17.384Z",
            "updated_at": "2024-04-21T15:21:17.384Z",
            "deleted_at": null
        }, {
            "id": 3523336,
            "region_code": 52,
            "region_name": "Омская область",
            "created_at": "2024-04-21T15:21:17.428Z",
            "updated_at": "2024-04-21T15:21:17.428Z",
            "deleted_at": null
        }, {
            "id": 3526088,
            "region_code": 96,
            "region_name": "Чеченская Республика",
            "created_at": "2024-04-21T15:21:17.565Z",
            "updated_at": "2024-04-21T15:21:17.565Z",
            "deleted_at": null
        }, {
            "id": 3526256,
            "region_code": 92,
            "region_name": "Республика Татарстан",
            "created_at": "2024-04-21T15:21:17.572Z",
            "updated_at": "2024-04-21T15:21:17.572Z",
            "deleted_at": null
        }, {
            "id": 3529597,
            "region_code": 34,
            "region_name": "Костромская область",
            "created_at": "2024-04-21T15:21:17.712Z",
            "updated_at": "2024-04-21T15:21:17.712Z",
            "deleted_at": null
        }, {
            "id": 3530396,
            "region_code": 93,
            "region_name": "Республика Тыва",
            "created_at": "2024-04-21T15:21:17.747Z",
            "updated_at": "2024-04-21T15:21:17.747Z",
            "deleted_at": null
        }, {
            "id": 3530902,
            "region_code": 12,
            "region_name": "Астраханская область",
            "created_at": "2024-04-21T15:21:17.769Z",
            "updated_at": "2024-04-21T15:21:17.769Z",
            "deleted_at": null
        }, {
            "id": 3531805,
            "region_code": 71100,
            "region_name": "Ханты-Мансийский АО",
            "created_at": "2024-04-21T15:21:17.812Z",
            "updated_at": "2024-04-21T15:21:17.812Z",
            "deleted_at": null
        }, {
            "id": 3533094,
            "region_code": 30,
            "region_name": "Камчатский край",
            "created_at": "2024-04-21T15:21:17.864Z",
            "updated_at": "2024-04-21T15:21:17.864Z",
            "deleted_at": null
        }, {
            "id": 3533470,
            "region_code": 22,
            "region_name": "Нижегородская область",
            "created_at": "2024-04-21T15:21:17.881Z",
            "updated_at": "2024-04-21T15:21:17.881Z",
            "deleted_at": null
        }, {
            "id": 3538137,
            "region_code": 44,
            "region_name": "Магаданская область",
            "created_at": "2024-04-21T15:21:18.095Z",
            "updated_at": "2024-04-21T15:21:18.095Z",
            "deleted_at": null
        }, {
            "id": 3538314,
            "region_code": 10011,
            "region_name": "Ненецкий АО",
            "created_at": "2024-04-21T15:21:18.104Z",
            "updated_at": "2024-04-21T15:21:18.104Z",
            "deleted_at": null
        }, {
            "id": 3538328,
            "region_code": 85,
            "region_name": "Республика Калмыкия",
            "created_at": "2024-04-21T15:21:18.105Z",
            "updated_at": "2024-04-21T15:21:18.105Z",
            "deleted_at": null
        }, {
            "id": 3538861,
            "region_code": 78,
            "region_name": "Ярославская область",
            "created_at": "2024-04-21T15:21:18.131Z",
            "updated_at": "2024-04-21T15:21:18.131Z",
            "deleted_at": null
        }, {
            "id": 3540289,
            "region_code": 73,
            "region_name": "Ульяновская область",
            "created_at": "2024-04-21T15:21:18.197Z",
            "updated_at": "2024-04-21T15:21:18.197Z",
            "deleted_at": null
        }, {
            "id": 3541322,
            "region_code": 5,
            "region_name": "Приморский край",
            "created_at": "2024-04-21T15:21:18.240Z",
            "updated_at": "2024-04-21T15:21:18.240Z",
            "deleted_at": null
        }, {
            "id": 3543627,
            "region_code": 19,
            "region_name": "Вологодская область",
            "created_at": "2024-04-21T15:21:18.335Z",
            "updated_at": "2024-04-21T15:21:18.335Z",
            "deleted_at": null
        }, {
            "id": 3544918,
            "region_code": 1,
            "region_name": "Алтайский край",
            "created_at": "2024-04-21T15:21:18.391Z",
            "updated_at": "2024-04-21T15:21:18.391Z",
            "deleted_at": null
        }, {
            "id": 3547167,
            "region_code": 77,
            "region_name": "Чукотский автономный округ",
            "created_at": "2024-04-21T15:21:18.494Z",
            "updated_at": "2024-04-21T15:21:18.494Z",
            "deleted_at": null
        }, {
            "id": 3547180,
            "region_code": 79,
            "region_name": "Республика Адыгея",
            "created_at": "2024-04-21T15:21:18.495Z",
            "updated_at": "2024-04-21T15:21:18.495Z",
            "deleted_at": null
        }, {
            "id": 3547619,
            "region_code": 101,
            "region_name": "Сириус",
            "created_at": "2024-04-21T15:21:18.512Z",
            "updated_at": "2024-04-21T15:21:18.512Z",
            "deleted_at": null
        }, {
            "id": 3547672,
            "region_code": 87,
            "region_name": "Республика Коми",
            "created_at": "2024-04-21T15:21:18.514Z",
            "updated_at": "2024-04-21T15:21:18.514Z",
            "deleted_at": null
        }, {
            "id": 3548532,
            "region_code": 54,
            "region_name": "Орловская область",
            "created_at": "2024-04-21T15:21:18.550Z",
            "updated_at": "2024-04-21T15:21:18.550Z",
            "deleted_at": null
        }, {
            "id": 3549193,
            "region_code": 99,
            "region_name": "Еврейская автономная область",
            "created_at": "2024-04-21T15:21:18.577Z",
            "updated_at": "2024-04-21T15:21:18.577Z",
            "deleted_at": null
        }, {
            "id": 3549411,
            "region_code": 32,
            "region_name": "Кемеровская область - Кузбасс",
            "created_at": "2024-04-21T15:21:18.587Z",
            "updated_at": "2024-04-21T15:21:18.587Z",
            "deleted_at": null
        }, {
            "id": 3551915,
            "region_code": 10,
            "region_name": "Амурская область",
            "created_at": "2024-04-21T15:21:18.712Z",
            "updated_at": "2024-04-21T15:21:18.712Z",
            "deleted_at": null
        }, {
            "id": 3553066,
            "region_code": 18,
            "region_name": "Волгоградская область",
            "created_at": "2024-04-21T15:21:18.770Z",
            "updated_at": "2024-04-21T15:21:18.770Z",
            "deleted_at": null
        }, {
            "id": 3555505,
            "region_code": 98,
            "region_name": "Республика Саха (Якутия)",
            "created_at": "2024-04-21T15:21:18.886Z",
            "updated_at": "2024-04-21T15:21:18.886Z",
            "deleted_at": null
        }, {
            "id": 3556311,
            "region_code": 71140,
            "region_name": "Ямало-Ненецкий АО",
            "created_at": "2024-04-21T15:21:18.921Z",
            "updated_at": "2024-04-21T15:21:18.921Z",
            "deleted_at": null
        }, {
            "id": 3556578,
            "region_code": 26,
            "region_name": "Республика Ингушетия",
            "created_at": "2024-04-21T15:21:18.932Z",
            "updated_at": "2024-04-21T15:21:18.932Z",
            "deleted_at": null
        }, {
            "id": 3556773,
            "region_code": 63,
            "region_name": "Саратовская область",
            "created_at": "2024-04-21T15:21:18.943Z",
            "updated_at": "2024-04-21T15:21:18.943Z",
            "deleted_at": null
        }, {
            "id": 3559428,
            "region_code": 8,
            "region_name": "Хабаровский край",
            "created_at": "2024-04-21T15:21:19.065Z",
            "updated_at": "2024-04-21T15:21:19.065Z",
            "deleted_at": null
        }, {
            "id": 3560753,
            "region_code": 64,
            "region_name": "Сахалинская область",
            "created_at": "2024-04-21T15:21:19.123Z",
            "updated_at": "2024-04-21T15:21:19.123Z",
            "deleted_at": null
        }, {
            "id": 3561181,
            "region_code": 33,
            "region_name": "Кировская область",
            "created_at": "2024-04-21T15:21:19.145Z",
            "updated_at": "2024-04-21T15:21:19.145Z",
            "deleted_at": null
        }, {
            "id": 3562762,
            "region_code": 65,
            "region_name": "Свердловская область",
            "created_at": "2024-04-21T15:21:19.222Z",
            "updated_at": "2024-04-21T15:21:19.222Z",
            "deleted_at": null
        }, {
            "id": 3565571,
            "region_code": 11,
            "region_name": "Архангельская область",
            "created_at": "2024-04-21T15:21:19.347Z",
            "updated_at": "2024-04-21T15:21:19.347Z",
            "deleted_at": null
        }, {
            "id": 3566338,
            "region_code": 29,
            "region_name": "Калужская область",
            "created_at": "2024-04-21T15:21:19.385Z",
            "updated_at": "2024-04-21T15:21:19.385Z",
            "deleted_at": null
        }, {
            "id": 3567495,
            "region_code": 35,
            "region_name": "Республика Крым",
            "created_at": "2024-04-21T15:21:19.444Z",
            "updated_at": "2024-04-21T15:21:19.444Z",
            "deleted_at": null
        }, {
            "id": 3568934,
            "region_code": 60,
            "region_name": "Ростовская область",
            "created_at": "2024-04-21T15:21:19.507Z",
            "updated_at": "2024-04-21T15:21:19.507Z",
            "deleted_at": null
        }, {
            "id": 3571723,
            "region_code": 86,
            "region_name": "Республика Карелия",
            "created_at": "2024-04-21T15:21:19.621Z",
            "updated_at": "2024-04-21T15:21:19.621Z",
            "deleted_at": null
        }, {
            "id": 3572299,
            "region_code": 3,
            "region_name": "Краснодарский край",
            "created_at": "2024-04-21T15:21:19.647Z",
            "updated_at": "2024-04-21T15:21:19.647Z",
            "deleted_at": null
        }, {
            "id": 3578454,
            "region_code": 7,
            "region_name": "Ставропольский край",
            "created_at": "2024-04-21T15:21:19.910Z",
            "updated_at": "2024-04-21T15:21:19.910Z",
            "deleted_at": null
        }, {
            "id": 3580957,
            "region_code": 49,
            "region_name": "Новгородская область",
            "created_at": "2024-04-21T15:21:20.017Z",
            "updated_at": "2024-04-21T15:21:20.017Z",
            "deleted_at": null
        }, {
            "id": 3581627,
            "region_code": 4,
            "region_name": "Красноярский край",
            "created_at": "2024-04-21T15:21:20.047Z",
            "updated_at": "2024-04-21T15:21:20.047Z",
            "deleted_at": null
        }, {
            "id": 3584586,
            "region_code": 71,
            "region_name": "Тюменская область",
            "created_at": "2024-04-21T15:21:20.181Z",
            "updated_at": "2024-04-21T15:21:20.181Z",
            "deleted_at": null
        }, {
            "id": 3587442,
            "region_code": 69,
            "region_name": "Томская область",
            "created_at": "2024-04-21T15:21:20.313Z",
            "updated_at": "2024-04-21T15:21:20.313Z",
            "deleted_at": null
        }, {
            "id": 3587852,
            "region_code": 53,
            "region_name": "Оренбургская область",
            "created_at": "2024-04-21T15:21:20.332Z",
            "updated_at": "2024-04-21T15:21:20.332Z",
            "deleted_at": null
        }, {
            "id": 3589197,
            "region_code": 89,
            "region_name": "Республика Мордовия",
            "created_at": "2024-04-21T15:21:20.396Z",
            "updated_at": "2024-04-21T15:21:20.396Z",
            "deleted_at": null
        }, {
            "id": 3589768,
            "region_code": 82,
            "region_name": "Республика Дагестан",
            "created_at": "2024-04-21T15:21:20.422Z",
            "updated_at": "2024-04-21T15:21:20.422Z",
            "deleted_at": null
        }, {
            "id": 3591446,
            "region_code": 24,
            "region_name": "Ивановская область",
            "created_at": "2024-04-21T15:21:20.499Z",
            "updated_at": "2024-04-21T15:21:20.499Z",
            "deleted_at": null
        }, {
            "id": 3592502,
            "region_code": 41,
            "region_name": "Ленинградская область",
            "created_at": "2024-04-21T15:21:20.546Z",
            "updated_at": "2024-04-21T15:21:20.546Z",
            "deleted_at": null
        }, {
            "id": 3594345,
            "region_code": 42,
            "region_name": "Липецкая область",
            "created_at": "2024-04-21T15:21:20.619Z",
            "updated_at": "2024-04-21T15:21:20.619Z",
            "deleted_at": null
        }, {
            "id": 3595544,
            "region_code": 45,
            "region_name": "г. Москва",
            "created_at": "2024-04-21T15:21:20.671Z",
            "updated_at": "2024-04-21T15:21:20.671Z",
            "deleted_at": null
        }, {
            "id": 3603662,
            "region_code": 75,
            "region_name": "Челябинская область",
            "created_at": "2024-04-21T15:21:21.011Z",
            "updated_at": "2024-04-21T15:21:21.011Z",
            "deleted_at": null
        }, {
            "id": 3607351,
            "region_code": 25,
            "region_name": "Иркутская область",
            "created_at": "2024-04-21T15:21:21.181Z",
            "updated_at": "2024-04-21T15:21:21.181Z",
            "deleted_at": null
        }, {
            "id": 3609655,
            "region_code": 83,
            "region_name": "Кабардино-Балкарская Республика",
            "created_at": "2024-04-21T15:21:21.276Z",
            "updated_at": "2024-04-21T15:21:21.276Z",
            "deleted_at": null
        }, {
            "id": 3610294,
            "region_code": 94,
            "region_name": "Удмуртская Республика",
            "created_at": "2024-04-21T15:21:21.305Z",
            "updated_at": "2024-04-21T15:21:21.305Z",
            "deleted_at": null
        }, {
            "id": 3611596,
            "region_code": 28,
            "region_name": "Тверская область",
            "created_at": "2024-04-21T15:21:21.358Z",
            "updated_at": "2024-04-21T15:21:21.358Z",
            "deleted_at": null
        }, {
            "id": 3613045,
            "region_code": 47,
            "region_name": "Мурманская область",
            "created_at": "2024-04-21T15:21:21.424Z",
            "updated_at": "2024-04-21T15:21:21.424Z",
            "deleted_at": null
        }, {
            "id": 3613676,
            "region_code": 37,
            "region_name": "Курганская область",
            "created_at": "2024-04-21T15:21:21.451Z",
            "updated_at": "2024-04-21T15:21:21.451Z",
            "deleted_at": null
        }, {
            "id": 3614491,
            "region_code": 38,
            "region_name": "Курская область",
            "created_at": "2024-04-21T15:21:21.484Z",
            "updated_at": "2024-04-21T15:21:21.484Z",
            "deleted_at": null
        }, {
            "id": 3615527,
            "region_code": 46,
            "region_name": "Московская область",
            "created_at": "2024-04-21T15:21:21.528Z",
            "updated_at": "2024-04-21T15:21:21.528Z",
            "deleted_at": null
        }, {
            "id": 3619484,
            "region_code": 67,
            "region_name": "г. Севастополь",
            "created_at": "2024-04-21T15:21:21.703Z",
            "updated_at": "2024-04-21T15:21:21.703Z",
            "deleted_at": null
        }, {
            "id": 3620001,
            "region_code": 88,
            "region_name": "Республика Марий Эл",
            "created_at": "2024-04-21T15:21:21.726Z",
            "updated_at": "2024-04-21T15:21:21.726Z",
            "deleted_at": null
        }, {
            "id": 3620664,
            "region_code": 66,
            "region_name": "Смоленская область",
            "created_at": "2024-04-21T15:21:21.752Z",
            "updated_at": "2024-04-21T15:21:21.752Z",
            "deleted_at": null
        }, {
            "id": 3621603,
            "region_code": 95,
            "region_name": "Республика Хакасия",
            "created_at": "2024-04-21T15:21:21.791Z",
            "updated_at": "2024-04-21T15:21:21.791Z",
            "deleted_at": null
        }, {
            "id": 3622126,
            "region_code": 15,
            "region_name": "Брянская область",
            "created_at": "2024-04-21T15:21:21.812Z",
            "updated_at": "2024-04-21T15:21:21.812Z",
            "deleted_at": null
        }, {
            "id": 3622754,
            "region_code": 56,
            "region_name": "Пензенская область",
            "created_at": "2024-04-21T15:21:21.839Z",
            "updated_at": "2024-04-21T15:21:21.839Z",
            "deleted_at": null
        }, {
            "id": 3624309,
            "region_code": 97,
            "region_name": "Чувашская Республика",
            "created_at": "2024-04-21T15:21:21.903Z",
            "updated_at": "2024-04-21T15:21:21.903Z",
            "deleted_at": null
        }, {
            "id": 3625191,
            "region_code": 14,
            "region_name": "Белгородская область",
            "created_at": "2024-04-21T15:21:21.941Z",
            "updated_at": "2024-04-21T15:21:21.941Z",
            "deleted_at": null
        }, {
            "id": 3626297,
            "region_code": 84,
            "region_name": "Республика Алтай",
            "created_at": "2024-04-21T15:21:21.988Z",
            "updated_at": "2024-04-21T15:21:21.988Z",
            "deleted_at": null
        }, {
            "id": 3626633,
            "region_code": 81,
            "region_name": "Республика Бурятия",
            "created_at": "2024-04-21T15:21:22.003Z",
            "updated_at": "2024-04-21T15:21:22.003Z",
            "deleted_at": null
        }, {
            "id": 3627706,
            "region_code": 90,
            "region_name": "Республика Северная Осетия - Алания",
            "created_at": "2024-04-21T15:21:22.053Z",
            "updated_at": "2024-04-21T15:21:22.053Z",
            "deleted_at": null
        }, {
            "id": 3628588,
            "region_code": 58,
            "region_name": "Псковская область",
            "created_at": "2024-04-21T15:21:22.091Z",
            "updated_at": "2024-04-21T15:21:22.091Z",
            "deleted_at": null
        }, {
            "id": 3629275,
            "region_code": 70,
            "region_name": "Тульская область",
            "created_at": "2024-04-21T15:21:22.119Z",
            "updated_at": "2024-04-21T15:21:22.119Z",
            "deleted_at": null
        }, {
            "id": 3760691,
            "region_code": 50,
            "region_name": "Новосибирская область",
            "created_at": "2024-04-21T16:37:44.609Z",
            "updated_at": "2024-04-21T16:37:44.609Z",
            "deleted_at": null
        }]
    };
    response.status(200).json(result);
};

const getInjuredList = (request, response) => {
    // pool.query('SELECT * FROM public."Regions" ORDER BY id ASC', (error, results) => {
    //     if (error) {
    //         throw error;
    //     }
    let result = {
        isSuccess: true,
        message: "",
        data: [
            {
                id: 0,
                title: 'Все'
            },
            {
                id: 1,
                title: 'Без пострадавших'
            },
            {
                id: 2,
                title: 'С пострадавшими без погибших'
            },
            {
                id: 3,
                title: 'С летальным исходом'
            }
        ]
    };

    response.status(200).json(result);
    // });
};

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
const writeDataFromFileStub = (request, response) => {

    let result =
        {
            "isSuccess": true,
            "message": "File uploaded successfully!",
            "json": "[{\"date\":\"2021-01-01T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-02T00:00:00.000Z\",\"value\":2},{\"date\":\"2021-01-03T00:00:00.000Z\",\"value\":5},{\"date\":\"2021-01-04T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-05T00:00:00.000Z\",\"value\":6,\"region_code\":2},{\"date\":\"2021-01-06T00:00:00.000Z\",\"value\":44},{\"date\":\"2021-01-07T00:00:00.000Z\",\"value\":3},{\"date\":\"2021-01-08T00:00:00.000Z\",\"value\":36},{\"date\":\"2021-01-09T00:00:00.000Z\",\"value\":6},{\"date\":\"2021-01-10T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-11T00:00:00.000Z\",\"value\":17},{\"date\":\"2021-01-12T00:00:00.000Z\",\"value\":12},{\"date\":\"2021-01-13T00:00:00.000Z\",\"value\":2},{\"date\":\"2021-01-14T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-15T00:00:00.000Z\",\"value\":2},{\"date\":\"2021-01-16T00:00:00.000Z\",\"value\":5},{\"date\":\"2021-01-17T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-18T00:00:00.000Z\",\"value\":6},{\"date\":\"2021-01-19T00:00:00.000Z\",\"value\":44},{\"date\":\"2021-01-20T00:00:00.000Z\",\"value\":3},{\"date\":\"2021-01-21T00:00:00.000Z\",\"value\":36},{\"date\":\"2021-01-22T00:00:00.000Z\",\"value\":6},{\"date\":\"2021-01-23T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-24T00:00:00.000Z\",\"value\":17},{\"date\":\"2021-01-25T00:00:00.000Z\",\"value\":12},{\"date\":\"2021-01-26T00:00:00.000Z\",\"value\":2},{\"date\":\"2021-01-27T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-28T00:00:00.000Z\",\"value\":2},{\"date\":\"2021-01-29T00:00:00.000Z\",\"value\":5},{\"date\":\"2021-01-30T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-01-31T00:00:00.000Z\",\"value\":6},{\"date\":\"2021-02-01T00:00:00.000Z\",\"value\":44},{\"date\":\"2021-02-02T00:00:00.000Z\",\"value\":3},{\"date\":\"2021-02-03T00:00:00.000Z\",\"value\":36},{\"date\":\"2021-02-04T00:00:00.000Z\",\"value\":6},{\"date\":\"2021-02-05T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-02-06T00:00:00.000Z\",\"value\":17},{\"date\":\"2021-02-07T00:00:00.000Z\",\"value\":12},{\"date\":\"2021-02-08T00:00:00.000Z\",\"value\":2},{\"date\":\"2021-02-09T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-02-10T00:00:00.000Z\",\"value\":2},{\"date\":\"2021-02-11T00:00:00.000Z\",\"value\":5},{\"date\":\"2021-02-12T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-02-13T00:00:00.000Z\",\"value\":6},{\"date\":\"2021-02-14T00:00:00.000Z\",\"value\":44},{\"date\":\"2021-02-15T00:00:00.000Z\",\"value\":3},{\"date\":\"2021-02-16T00:00:00.000Z\",\"value\":36},{\"date\":\"2021-02-17T00:00:00.000Z\",\"value\":6},{\"date\":\"2021-02-18T00:00:00.000Z\",\"value\":1},{\"date\":\"2021-02-19T00:00:00.000Z\",\"value\":17}]"
        };
    response.status(200).json(result);
};

const writeDataFromFile = async (request, response, filepath) => {
    const analysis_factor_id = parseInt(request.params.id);

    //readfile

    rx.getJsonFromExcell(request, response, filepath, this);


    // pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    //     if (error) {
    //         throw error;
    //     }
    //     response.status(200).json(results.rows);
    //
    //
    // });
};

const createUser = (request, response) => {
    const {name, email} = request.body;

    pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        }
    );
};

const updateUser = (request, response) => {
    const id = parseInt(request.params.id);
    const {name, email} = request.body;

    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        }
    );
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};

const getAnalysisCorrelationStub = (request, response) => {
    let result = {
        "isSuccess": true,
        "message": "",
        "data": [{
            "date": "2023-08-31T21:00:00.000Z",
            "ycoords": 2.6251249999999997,
            "xcoords": "537"
        }, {
            "date": "2023-09-01T21:00:00.000Z",
            "ycoords": 4.499874999999999,
            "xcoords": "438"
        }, {
            "date": "2023-09-02T21:00:00.000Z",
            "ycoords": 3.4165,
            "xcoords": "393"
        }, {
            "date": "2023-09-03T21:00:00.000Z",
            "ycoords": 1.541625,
            "xcoords": "404"
        }, {
            "date": "2023-09-04T21:00:00.000Z",
            "ycoords": 1.7085,
            "xcoords": "367"
        }, {
            "date": "2023-09-05T21:00:00.000Z",
            "ycoords": 1.458375,
            "xcoords": "404"
        }, {
            "date": "2023-09-06T21:00:00.000Z",
            "ycoords": 1.3335,
            "xcoords": "403"
        }, {
            "date": "2023-09-07T21:00:00.000Z",
            "ycoords": 1.249875,
            "xcoords": "446"
        }, {"date": "2023-09-08T21:00:00.000Z", "ycoords": 1.75, "xcoords": "415"}, {
            "date": "2023-09-09T21:00:00.000Z",
            "ycoords": 0.541625,
            "xcoords": "420"
        }, {
            "date": "2023-09-10T21:00:00.000Z",
            "ycoords": 1.375,
            "xcoords": "354"
        }, {
            "date": "2023-09-11T21:00:00.000Z",
            "ycoords": 2.875,
            "xcoords": "417"
        }, {
            "date": "2023-09-12T21:00:00.000Z",
            "ycoords": 2.9167500000000004,
            "xcoords": "432"
        }, {
            "date": "2023-09-13T21:00:00.000Z",
            "ycoords": 2.9165,
            "xcoords": "427"
        }, {
            "date": "2023-09-14T21:00:00.000Z",
            "ycoords": 1.583375,
            "xcoords": "489"
        }, {
            "date": "2023-09-15T21:00:00.000Z",
            "ycoords": 1.291625,
            "xcoords": "502"
        }, {
            "date": "2023-09-16T21:00:00.000Z",
            "ycoords": 2.916625,
            "xcoords": "447"
        }, {"date": "2023-09-17T21:00:00.000Z", "ycoords": 4, "xcoords": "464"}, {
            "date": "2023-09-18T21:00:00.000Z",
            "ycoords": 4.666625,
            "xcoords": "423"
        }, {
            "date": "2023-09-19T21:00:00.000Z",
            "ycoords": 2.916625,
            "xcoords": "406"
        }, {
            "date": "2023-09-20T21:00:00.000Z",
            "ycoords": 2.16675,
            "xcoords": "433"
        }, {
            "date": "2023-09-21T21:00:00.000Z",
            "ycoords": 2.04175,
            "xcoords": "504"
        }, {
            "date": "2023-09-22T21:00:00.000Z",
            "ycoords": 2.083375,
            "xcoords": "534"
        }, {
            "date": "2023-09-23T21:00:00.000Z",
            "ycoords": 2.54175,
            "xcoords": "453"
        }, {
            "date": "2023-09-24T21:00:00.000Z",
            "ycoords": 3.4582499999999996,
            "xcoords": "446"
        }, {
            "date": "2023-09-25T21:00:00.000Z",
            "ycoords": 3.916625,
            "xcoords": "432"
        }, {
            "date": "2023-09-26T21:00:00.000Z",
            "ycoords": 2.708375,
            "xcoords": "432"
        }, {
            "date": "2023-09-27T21:00:00.000Z",
            "ycoords": 1.083375,
            "xcoords": "404"
        }, {
            "date": "2023-09-28T21:00:00.000Z",
            "ycoords": 2.2085000000000004,
            "xcoords": "471"
        }, {
            "date": "2023-09-29T21:00:00.000Z",
            "ycoords": 2.12475,
            "xcoords": "469"
        }, {
            "date": "2023-09-30T21:00:00.000Z",
            "ycoords": 1.8335,
            "xcoords": "405"
        }, {
            "date": "2023-10-01T21:00:00.000Z",
            "ycoords": 1.83325,
            "xcoords": "420"
        }, {
            "date": "2023-10-02T21:00:00.000Z",
            "ycoords": 1.666625,
            "xcoords": "389"
        }, {
            "date": "2023-10-03T21:00:00.000Z",
            "ycoords": 2.29175,
            "xcoords": "414"
        }, {
            "date": "2023-10-04T21:00:00.000Z",
            "ycoords": 2.4167500000000004,
            "xcoords": "433"
        }, {
            "date": "2023-10-05T21:00:00.000Z",
            "ycoords": 1.749875,
            "xcoords": "514"
        }, {
            "date": "2023-10-06T21:00:00.000Z",
            "ycoords": 0.95825,
            "xcoords": "493"
        }, {
            "date": "2023-10-07T21:00:00.000Z",
            "ycoords": 1.58325,
            "xcoords": "393"
        }, {
            "date": "2023-10-08T21:00:00.000Z",
            "ycoords": 1.874875,
            "xcoords": "396"
        }, {
            "date": "2023-10-09T21:00:00.000Z",
            "ycoords": 0.708375,
            "xcoords": "383"
        }, {
            "date": "2023-10-10T21:00:00.000Z",
            "ycoords": 0.5833750000000001,
            "xcoords": "398"
        }, {
            "date": "2023-10-11T21:00:00.000Z",
            "ycoords": 0.458375,
            "xcoords": "423"
        }, {
            "date": "2023-10-12T21:00:00.000Z",
            "ycoords": 2.5835,
            "xcoords": "494"
        }, {
            "date": "2023-10-13T21:00:00.000Z",
            "ycoords": 1.4165,
            "xcoords": "462"
        }, {
            "date": "2023-10-14T21:00:00.000Z",
            "ycoords": 0.583375,
            "xcoords": "389"
        }, {
            "date": "2023-10-15T21:00:00.000Z",
            "ycoords": 0.49987500000000007,
            "xcoords": "449"
        }, {
            "date": "2023-10-16T21:00:00.000Z",
            "ycoords": 0.249875,
            "xcoords": "393"
        }, {"date": "2023-10-17T21:00:00.000Z", "ycoords": 2, "xcoords": "453"}, {
            "date": "2023-10-18T21:00:00.000Z",
            "ycoords": 1.95825,
            "xcoords": "403"
        }, {
            "date": "2023-10-19T21:00:00.000Z",
            "ycoords": 1.708375,
            "xcoords": "471"
        }, {
            "date": "2023-10-20T21:00:00.000Z",
            "ycoords": 3.083375,
            "xcoords": "390"
        }, {
            "date": "2023-10-21T21:00:00.000Z",
            "ycoords": 1.79175,
            "xcoords": "333"
        }, {
            "date": "2023-10-22T21:00:00.000Z",
            "ycoords": 0.249875,
            "xcoords": "397"
        }, {
            "date": "2023-10-23T21:00:00.000Z",
            "ycoords": 0.6251249999999999,
            "xcoords": "384"
        }, {
            "date": "2023-10-24T21:00:00.000Z",
            "ycoords": 0.66675,
            "xcoords": "311"
        }, {
            "date": "2023-10-25T21:00:00.000Z",
            "ycoords": 3.375,
            "xcoords": "378"
        }, {
            "date": "2023-10-26T21:00:00.000Z",
            "ycoords": 2.208375,
            "xcoords": "432"
        }, {
            "date": "2023-10-27T21:00:00.000Z",
            "ycoords": 3.0001249999999997,
            "xcoords": "393"
        }, {
            "date": "2023-10-28T21:00:00.000Z",
            "ycoords": 3.916625,
            "xcoords": "347"
        }, {
            "date": "2023-10-29T21:00:00.000Z",
            "ycoords": 2.4165,
            "xcoords": "385"
        }, {
            "date": "2023-10-30T21:00:00.000Z",
            "ycoords": 1.875,
            "xcoords": "379"
        }, {
            "date": "2023-10-31T21:00:00.000Z",
            "ycoords": 1.958375,
            "xcoords": "376"
        }, {"date": "2023-11-01T21:00:00.000Z", "ycoords": 1.5, "xcoords": "384"}, {
            "date": "2023-11-02T21:00:00.000Z",
            "ycoords": 0.5417500000000001,
            "xcoords": "401"
        }, {
            "date": "2023-11-03T21:00:00.000Z",
            "ycoords": 1.9585,
            "xcoords": "370"
        }, {
            "date": "2023-11-04T21:00:00.000Z",
            "ycoords": 4.625125000000001,
            "xcoords": "339"
        }, {
            "date": "2023-11-05T21:00:00.000Z",
            "ycoords": 4.333375,
            "xcoords": "311"
        }, {
            "date": "2023-11-06T21:00:00.000Z",
            "ycoords": 3.125,
            "xcoords": "367"
        }, {
            "date": "2023-11-07T21:00:00.000Z",
            "ycoords": 2.8748750000000003,
            "xcoords": "350"
        }, {
            "date": "2023-11-08T21:00:00.000Z",
            "ycoords": 2.4167500000000004,
            "xcoords": "391"
        }, {
            "date": "2023-11-09T21:00:00.000Z",
            "ycoords": 1.958375,
            "xcoords": "393"
        }, {
            "date": "2023-11-10T21:00:00.000Z",
            "ycoords": 0.958375,
            "xcoords": "348"
        }, {
            "date": "2023-11-11T21:00:00.000Z",
            "ycoords": 1.875,
            "xcoords": "324"
        }, {
            "date": "2023-11-12T21:00:00.000Z",
            "ycoords": 2.416875,
            "xcoords": "439"
        }, {
            "date": "2023-11-13T21:00:00.000Z",
            "ycoords": 1.3335,
            "xcoords": "396"
        }, {
            "date": "2023-11-14T21:00:00.000Z",
            "ycoords": 2.625,
            "xcoords": "424"
        }, {
            "date": "2023-11-15T21:00:00.000Z",
            "ycoords": 1.583375,
            "xcoords": "390"
        }, {
            "date": "2023-11-16T21:00:00.000Z",
            "ycoords": 0.583375,
            "xcoords": "445"
        }, {
            "date": "2023-11-17T21:00:00.000Z",
            "ycoords": 0.291625,
            "xcoords": "344"
        }, {
            "date": "2023-11-18T21:00:00.000Z",
            "ycoords": 0.666625,
            "xcoords": "302"
        }, {
            "date": "2023-11-19T21:00:00.000Z",
            "ycoords": 1.125,
            "xcoords": "369"
        }, {
            "date": "2023-11-20T21:00:00.000Z",
            "ycoords": 3.1248750000000003,
            "xcoords": "334"
        }, {
            "date": "2023-11-21T21:00:00.000Z",
            "ycoords": 3.9998750000000003,
            "xcoords": "376"
        }, {
            "date": "2023-11-22T21:00:00.000Z",
            "ycoords": 1.374875,
            "xcoords": "321"
        }, {
            "date": "2023-11-23T21:00:00.000Z",
            "ycoords": 1.91675,
            "xcoords": "450"
        }, {
            "date": "2023-11-24T21:00:00.000Z",
            "ycoords": 4.29175,
            "xcoords": "314"
        }, {
            "date": "2023-11-25T21:00:00.000Z",
            "ycoords": 1.833375,
            "xcoords": "336"
        }, {
            "date": "2023-11-26T21:00:00.000Z",
            "ycoords": 1.70825,
            "xcoords": "332"
        }, {
            "date": "2023-11-27T21:00:00.000Z",
            "ycoords": 1.666625,
            "xcoords": "310"
        }, {
            "date": "2023-11-28T21:00:00.000Z",
            "ycoords": 1.0418749999999999,
            "xcoords": "347"
        }, {"date": "2023-11-29T21:00:00.000Z", "ycoords": 1.124875, "xcoords": "303"}]
    };
    response.status(200).json(result);
};
const getAnalysisCorrelation = (request, response) => {
    const method = request.body;

    let analysis_factor_id = request.query.analysis_factor_id;
    let start_date = request.query.start_date;
    let end_date = request.query.end_date;

    if (start_date === undefined) {
        let result = {
            isSuccess: false,
            message: "Body parameter start_date is wrong",
        };
        response.status(300).json(result);
    } else if (end_date === undefined) {
        let result = {
            isSuccess: false,
            message: "Body parameter end_date is wrong",
        };
        response.status(300).json(result);
    } else if (analysis_factor_id === undefined) {
        let result = {
            isSuccess: false,
            message: "Body parameter analysis_factor_id is wrong",
        };
        response.status(300).json(result);
    } else {
        let query = 'select foo.date, avg(origin_value) as ycoords, xcoords from(SELECT CAST(date as Date) as date, ' +
            'origin_value as origin_value  FROM public."factor_data"where analysis_factor_id in (\'' + analysis_factor_id + '\')  ' +
            'and date between \'' + start_date + '\' and \'' + end_date + '\') as foo inner join ' +
            '(SELECT CAST(date As Date) as date, COUNT(id) as xcoords  FROM public."DTPCard"where region_id in ' +
            '(select id from public."Regions")  and date between \'' + start_date + '\' and \'' + end_date + '\' GROUP BY CAST(date As Date) ' +
            'order by date) as bar on foo.date = bar.date group by foo.date, xcoords order by date';
        console.log(query);

        pool.query(query, (error, results) => {
            if (error) {
                throw error;
            }
            let result = {
                isSuccess: true,
                message: "",
                data: results.rows
            };

            response.status(200).json(result);
        });
    }
};

const getAnalysisCorrelationCalcStub = (request, response) => {
    let result = {
        "isSuccess": true, "message": "", "data": {
            "sumX": 913.2056249999997,
            "sumY": 165931,
            "xy": 328970.55549999996,
            "x2": 2287.7162060781247,
            "y2": 62575351,
            "slau1": "2287.7162060781247a + 456b = 328970.55549999996",
            "slau2": "913.2056249999997a + 456b = 165931",
            "delta": 209254.07643998484,
            "lineX1": 0.041625,
            "lineX2": 6.208375,
            "lineY1": 378.1148151671724,
            "lineY2": 333.36293376705373,
            "a": -7.2569637815897705,
            "deltaA": -1518549.2538749874,
            "deltaB": 79185276.04877478,
            "b": 378.4168862845811,
            "function": "y = -7.2569637815897705x + 378.4168862845811",
            "rxy": -0.10491021360182251,
            "vivodRXY": "Линейная корреляционная зависимость количества ДТП от исследуемого фактора слабая",
            "koefDet": "0.011006153",
            "koefDetVivod": "В рамках построенной модели  количество ДТП на 1.100615300% зависит от выбранного фактора",
            "elasticKoef": -0.039938891140106715,
            "elasticKoefVivod": "Зависимый показатель неэластичен к воздействию признака-фактора.",
            "betaKoef": -0.10491021360182459,
            "betaVivod": "Количество средних квадратических отклонений, на которое меняется признак-результат при увеличении прзнака-фактора на одно среднее квадратичное отклонение равно 0.10491021360182459 и имеет умеренное влияние",
            "coords": [{
                "date": "2022-08-31T21:00:00.000Z",
                "xcoords": 1.9581250000000001,
                "ycoords": "349"
            }, {
                "date": "2022-09-01T21:00:00.000Z",
                "xcoords": 1.75,
                "ycoords": "442"
            }, {
                "date": "2022-09-02T21:00:00.000Z",
                "xcoords": 3.5415,
                "ycoords": "407"
            }, {
                "date": "2022-09-03T21:00:00.000Z",
                "xcoords": 5.41675,
                "ycoords": "397"
            }, {
                "date": "2022-09-04T21:00:00.000Z",
                "xcoords": 4.5,
                "ycoords": "361"
            }, {
                "date": "2022-09-05T21:00:00.000Z",
                "xcoords": 3.375,
                "ycoords": "360"
            }, {
                "date": "2022-09-06T21:00:00.000Z",
                "xcoords": 2.666625,
                "ycoords": "362"
            }, {
                "date": "2022-09-07T21:00:00.000Z",
                "xcoords": 3.25,
                "ycoords": "360"
            }, {
                "date": "2022-09-08T21:00:00.000Z",
                "xcoords": 2.416875,
                "ycoords": "466"
            }, {
                "date": "2022-09-09T21:00:00.000Z",
                "xcoords": 2.625,
                "ycoords": "430"
            }, {
                "date": "2022-09-10T21:00:00.000Z",
                "xcoords": 1.916625,
                "ycoords": "417"
            }, {
                "date": "2022-09-11T21:00:00.000Z",
                "xcoords": 1.66675,
                "ycoords": "399"
            }, {
                "date": "2022-09-12T21:00:00.000Z",
                "xcoords": 0.54175,
                "ycoords": "407"
            }, {
                "date": "2022-09-13T21:00:00.000Z",
                "xcoords": 1.791875,
                "ycoords": "367"
            }, {
                "date": "2022-09-14T21:00:00.000Z",
                "xcoords": 1.250125,
                "ycoords": "397"
            }, {
                "date": "2022-09-15T21:00:00.000Z",
                "xcoords": 0.9582499999999999,
                "ycoords": "432"
            }, {
                "date": "2022-09-16T21:00:00.000Z",
                "xcoords": 1,
                "ycoords": "454"
            }, {
                "date": "2022-09-17T21:00:00.000Z",
                "xcoords": 2.29175,
                "ycoords": "418"
            }, {
                "date": "2022-09-18T21:00:00.000Z",
                "xcoords": 2.29175,
                "ycoords": "393"
            }, {
                "date": "2022-09-19T21:00:00.000Z",
                "xcoords": 1.83325,
                "ycoords": "416"
            }, {
                "date": "2022-09-20T21:00:00.000Z",
                "xcoords": 1.083375,
                "ycoords": "374"
            }, {
                "date": "2022-09-21T21:00:00.000Z",
                "xcoords": 1.208375,
                "ycoords": "392"
            }, {
                "date": "2022-09-22T21:00:00.000Z",
                "xcoords": 2.458125,
                "ycoords": "422"
            }, {
                "date": "2022-09-23T21:00:00.000Z",
                "xcoords": 2.666625,
                "ycoords": "479"
            }, {
                "date": "2022-09-24T21:00:00.000Z",
                "xcoords": 1.333375,
                "ycoords": "422"
            }, {
                "date": "2022-09-25T21:00:00.000Z",
                "xcoords": 0.9165000000000001,
                "ycoords": "367"
            }, {
                "date": "2022-09-26T21:00:00.000Z",
                "xcoords": 3.3332499999999996,
                "ycoords": "335"
            }, {
                "date": "2022-09-27T21:00:00.000Z",
                "xcoords": 0.83325,
                "ycoords": "368"
            }, {
                "date": "2022-09-28T21:00:00.000Z",
                "xcoords": 1.541625,
                "ycoords": "377"
            }, {
                "date": "2022-09-29T21:00:00.000Z",
                "xcoords": 2.41675,
                "ycoords": "409"
            }, {
                "date": "2022-09-30T21:00:00.000Z",
                "xcoords": 0.45824999999999994,
                "ycoords": "398"
            }, {
                "date": "2022-10-01T21:00:00.000Z",
                "xcoords": 2.3748750000000003,
                "ycoords": "360"
            }, {
                "date": "2022-10-02T21:00:00.000Z",
                "xcoords": 3.458375,
                "ycoords": "392"
            }, {
                "date": "2022-10-03T21:00:00.000Z",
                "xcoords": 2.9165,
                "ycoords": "390"
            }, {
                "date": "2022-10-04T21:00:00.000Z",
                "xcoords": 2.7498750000000003,
                "ycoords": "395"
            }, {
                "date": "2022-10-05T21:00:00.000Z",
                "xcoords": 3.0415,
                "ycoords": "400"
            }, {
                "date": "2022-10-06T21:00:00.000Z",
                "xcoords": 2.625125,
                "ycoords": "463"
            }, {
                "date": "2022-10-07T21:00:00.000Z",
                "xcoords": 2.375125,
                "ycoords": "459"
            }, {
                "date": "2022-10-08T21:00:00.000Z",
                "xcoords": 3.7085,
                "ycoords": "448"
            }, {
                "date": "2022-10-09T21:00:00.000Z",
                "xcoords": 2.083125,
                "ycoords": "412"
            }, {
                "date": "2022-10-10T21:00:00.000Z",
                "xcoords": 1.4165,
                "ycoords": "403"
            }, {
                "date": "2022-10-11T21:00:00.000Z",
                "xcoords": 1.125,
                "ycoords": "408"
            }, {
                "date": "2022-10-12T21:00:00.000Z",
                "xcoords": 0.83325,
                "ycoords": "374"
            }, {
                "date": "2022-10-13T21:00:00.000Z",
                "xcoords": 2.916625,
                "ycoords": "480"
            }, {
                "date": "2022-10-14T21:00:00.000Z",
                "xcoords": 2.79175,
                "ycoords": "438"
            }, {
                "date": "2022-10-15T21:00:00.000Z",
                "xcoords": 2.916625,
                "ycoords": "381"
            }, {
                "date": "2022-10-16T21:00:00.000Z",
                "xcoords": 0.833375,
                "ycoords": "420"
            }, {
                "date": "2022-10-17T21:00:00.000Z",
                "xcoords": 1.33325,
                "ycoords": "399"
            }, {
                "date": "2022-10-18T21:00:00.000Z",
                "xcoords": 0.875,
                "ycoords": "403"
            }, {
                "date": "2022-10-19T21:00:00.000Z",
                "xcoords": 1.41675,
                "ycoords": "364"
            }, {
                "date": "2022-10-20T21:00:00.000Z",
                "xcoords": 0.9165000000000001,
                "ycoords": "404"
            }, {
                "date": "2022-10-21T21:00:00.000Z",
                "xcoords": 3.41675,
                "ycoords": "375"
            }, {
                "date": "2022-10-22T21:00:00.000Z",
                "xcoords": 2.66675,
                "ycoords": "344"
            }, {
                "date": "2022-10-23T21:00:00.000Z",
                "xcoords": 1.583375,
                "ycoords": "414"
            }, {
                "date": "2022-10-24T21:00:00.000Z",
                "xcoords": 0.7498750000000001,
                "ycoords": "350"
            }, {
                "date": "2022-10-25T21:00:00.000Z",
                "xcoords": 0.875,
                "ycoords": "360"
            }, {
                "date": "2022-10-26T21:00:00.000Z",
                "xcoords": 2.250125,
                "ycoords": "379"
            }, {
                "date": "2022-10-27T21:00:00.000Z",
                "xcoords": 2.833125,
                "ycoords": "448"
            }, {
                "date": "2022-10-28T21:00:00.000Z",
                "xcoords": 3.75,
                "ycoords": "388"
            }, {
                "date": "2022-10-29T21:00:00.000Z",
                "xcoords": 2.45825,
                "ycoords": "379"
            }, {
                "date": "2022-10-30T21:00:00.000Z",
                "xcoords": 2.458375,
                "ycoords": "410"
            }, {
                "date": "2022-10-31T21:00:00.000Z",
                "xcoords": 1.66675,
                "ycoords": "373"
            }, {
                "date": "2022-11-01T21:00:00.000Z",
                "xcoords": 2.75,
                "ycoords": "368"
            }, {
                "date": "2022-11-02T21:00:00.000Z",
                "xcoords": 3.708375,
                "ycoords": "412"
            }, {
                "date": "2022-11-03T21:00:00.000Z",
                "xcoords": 2.875,
                "ycoords": "366"
            }, {
                "date": "2022-11-04T21:00:00.000Z",
                "xcoords": 2.0001249999999997,
                "ycoords": "362"
            }, {
                "date": "2022-11-05T21:00:00.000Z",
                "xcoords": 0.5417500000000001,
                "ycoords": "339"
            }, {
                "date": "2022-11-06T21:00:00.000Z",
                "xcoords": 2.8751250000000006,
                "ycoords": "326"
            }, {
                "date": "2022-11-07T21:00:00.000Z",
                "xcoords": 2.375,
                "ycoords": "368"
            }, {
                "date": "2022-11-08T21:00:00.000Z",
                "xcoords": 1.166625,
                "ycoords": "344"
            }, {
                "date": "2022-11-09T21:00:00.000Z",
                "xcoords": 0.041625,
                "ycoords": "408"
            }, {
                "date": "2022-11-10T21:00:00.000Z",
                "xcoords": 1.79175,
                "ycoords": "468"
            }, {
                "date": "2022-11-11T21:00:00.000Z",
                "xcoords": 1.083375,
                "ycoords": "449"
            }, {
                "date": "2022-11-12T21:00:00.000Z",
                "xcoords": 1.666625,
                "ycoords": "364"
            }, {
                "date": "2022-11-13T21:00:00.000Z",
                "xcoords": 0.75,
                "ycoords": "401"
            }, {
                "date": "2022-11-14T21:00:00.000Z",
                "xcoords": 0.41637500000000005,
                "ycoords": "373"
            }, {
                "date": "2022-11-15T21:00:00.000Z",
                "xcoords": 0.458125,
                "ycoords": "389"
            }, {
                "date": "2022-11-16T21:00:00.000Z",
                "xcoords": 0.25012500000000004,
                "ycoords": "413"
            }, {
                "date": "2022-11-17T21:00:00.000Z",
                "xcoords": 1.416625,
                "ycoords": "454"
            }, {
                "date": "2022-11-18T21:00:00.000Z",
                "xcoords": 0.95825,
                "ycoords": "376"
            }, {
                "date": "2022-11-19T21:00:00.000Z",
                "xcoords": 1.208375,
                "ycoords": "303"
            }, {
                "date": "2022-11-20T21:00:00.000Z",
                "xcoords": 2.0416250000000002,
                "ycoords": "363"
            }, {
                "date": "2022-11-21T21:00:00.000Z",
                "xcoords": 0.45825000000000005,
                "ycoords": "371"
            }, {
                "date": "2022-11-22T21:00:00.000Z",
                "xcoords": 0.416625,
                "ycoords": "364"
            }, {
                "date": "2022-11-23T21:00:00.000Z",
                "xcoords": 1.333375,
                "ycoords": "342"
            }, {
                "date": "2022-11-24T21:00:00.000Z",
                "xcoords": 3.25,
                "ycoords": "371"
            }, {
                "date": "2022-11-25T21:00:00.000Z",
                "xcoords": 2.958375,
                "ycoords": "358"
            }, {
                "date": "2022-11-26T21:00:00.000Z",
                "xcoords": 2.7501249999999997,
                "ycoords": "280"
            }, {
                "date": "2022-11-27T21:00:00.000Z",
                "xcoords": 3.2082500000000005,
                "ycoords": "321"
            }, {
                "date": "2022-11-28T21:00:00.000Z",
                "xcoords": 3.3748749999999994,
                "ycoords": "320"
            }, {
                "date": "2022-11-29T21:00:00.000Z",
                "xcoords": 3.5832499999999996,
                "ycoords": "349"
            }, {
                "date": "2022-11-30T21:00:00.000Z",
                "xcoords": 3.7502500000000003,
                "ycoords": "312"
            }, {
                "date": "2022-12-01T21:00:00.000Z",
                "xcoords": 3,
                "ycoords": "348"
            }, {
                "date": "2022-12-02T21:00:00.000Z",
                "xcoords": 2.2916250000000002,
                "ycoords": "320"
            }, {
                "date": "2022-12-03T21:00:00.000Z",
                "xcoords": 2.791625,
                "ycoords": "290"
            }, {
                "date": "2022-12-04T21:00:00.000Z",
                "xcoords": 1.58325,
                "ycoords": "339"
            }, {
                "date": "2022-12-05T21:00:00.000Z",
                "xcoords": 0.75,
                "ycoords": "316"
            }, {
                "date": "2022-12-06T21:00:00.000Z",
                "xcoords": 2.5417500000000004,
                "ycoords": "348"
            }, {
                "date": "2022-12-07T21:00:00.000Z",
                "xcoords": 1.958375,
                "ycoords": "361"
            }, {
                "date": "2022-12-08T21:00:00.000Z",
                "xcoords": 2.208375,
                "ycoords": "442"
            }, {
                "date": "2022-12-09T21:00:00.000Z",
                "xcoords": 1.9168749999999999,
                "ycoords": "388"
            }, {
                "date": "2022-12-10T21:00:00.000Z",
                "xcoords": 2.125,
                "ycoords": "326"
            }, {
                "date": "2022-12-11T21:00:00.000Z",
                "xcoords": 1.291625,
                "ycoords": "424"
            }, {
                "date": "2022-12-12T21:00:00.000Z",
                "xcoords": 0.625,
                "ycoords": "361"
            }, {
                "date": "2022-12-13T21:00:00.000Z",
                "xcoords": 1,
                "ycoords": "368"
            }, {
                "date": "2022-12-14T21:00:00.000Z",
                "xcoords": 1.333375,
                "ycoords": "340"
            }, {
                "date": "2022-12-15T21:00:00.000Z",
                "xcoords": 1,
                "ycoords": "375"
            }, {
                "date": "2022-12-16T21:00:00.000Z",
                "xcoords": 0.45825000000000005,
                "ycoords": "355"
            }, {
                "date": "2022-12-17T21:00:00.000Z",
                "xcoords": 0.791625,
                "ycoords": "314"
            }, {
                "date": "2022-12-18T21:00:00.000Z",
                "xcoords": 2.083375,
                "ycoords": "340"
            }, {
                "date": "2022-12-19T21:00:00.000Z",
                "xcoords": 1.1665,
                "ycoords": "320"
            }, {
                "date": "2022-12-20T21:00:00.000Z",
                "xcoords": 2.041875,
                "ycoords": "328"
            }, {
                "date": "2022-12-21T21:00:00.000Z",
                "xcoords": 2.083375,
                "ycoords": "331"
            }, {
                "date": "2022-12-22T21:00:00.000Z",
                "xcoords": 3.3751250000000006,
                "ycoords": "395"
            }, {
                "date": "2022-12-23T21:00:00.000Z",
                "xcoords": 3.583125,
                "ycoords": "341"
            }, {
                "date": "2022-12-24T21:00:00.000Z",
                "xcoords": 2.0001249999999997,
                "ycoords": "307"
            }, {
                "date": "2022-12-25T21:00:00.000Z",
                "xcoords": 3.1667500000000004,
                "ycoords": "309"
            }, {
                "date": "2022-12-26T21:00:00.000Z",
                "xcoords": 3.6665,
                "ycoords": "335"
            }, {
                "date": "2022-12-27T21:00:00.000Z",
                "xcoords": 1.125125,
                "ycoords": "452"
            }, {
                "date": "2022-12-28T21:00:00.000Z",
                "xcoords": 2,
                "ycoords": "415"
            }, {
                "date": "2022-12-29T21:00:00.000Z",
                "xcoords": 4.041625,
                "ycoords": "398"
            }, {
                "date": "2022-12-30T21:00:00.000Z",
                "xcoords": 2.9167499999999995,
                "ycoords": "312"
            }, {
                "date": "2022-12-31T21:00:00.000Z",
                "xcoords": 2.7501249999999997,
                "ycoords": "267"
            }, {
                "date": "2023-01-01T21:00:00.000Z",
                "xcoords": 1.791625,
                "ycoords": "330"
            }, {
                "date": "2023-01-02T21:00:00.000Z",
                "xcoords": 1.33325,
                "ycoords": "268"
            }, {
                "date": "2023-01-03T21:00:00.000Z",
                "xcoords": 3,
                "ycoords": "239"
            }, {
                "date": "2023-01-04T21:00:00.000Z",
                "xcoords": 1.79175,
                "ycoords": "248"
            }, {
                "date": "2023-01-05T21:00:00.000Z",
                "xcoords": 0.7915000000000001,
                "ycoords": "243"
            }, {
                "date": "2023-01-06T21:00:00.000Z",
                "xcoords": 1.2915,
                "ycoords": "219"
            }, {
                "date": "2023-01-07T21:00:00.000Z",
                "xcoords": 1.75,
                "ycoords": "217"
            }, {
                "date": "2023-01-08T21:00:00.000Z",
                "xcoords": 1.125,
                "ycoords": "201"
            }, {
                "date": "2023-01-09T21:00:00.000Z",
                "xcoords": 1.416875,
                "ycoords": "231"
            }, {
                "date": "2023-01-10T21:00:00.000Z",
                "xcoords": 1.91675,
                "ycoords": "239"
            }, {
                "date": "2023-01-11T21:00:00.000Z",
                "xcoords": 2.16675,
                "ycoords": "250"
            }, {
                "date": "2023-01-12T21:00:00.000Z",
                "xcoords": 2.45825,
                "ycoords": "313"
            }, {
                "date": "2023-01-13T21:00:00.000Z",
                "xcoords": 2.04175,
                "ycoords": "261"
            }, {
                "date": "2023-01-14T21:00:00.000Z",
                "xcoords": 4.00025,
                "ycoords": "219"
            }, {
                "date": "2023-01-15T21:00:00.000Z",
                "xcoords": 2.583375,
                "ycoords": "320"
            }, {
                "date": "2023-01-16T21:00:00.000Z",
                "xcoords": 1.125,
                "ycoords": "310"
            }, {
                "date": "2023-01-17T21:00:00.000Z",
                "xcoords": 2.6667500000000004,
                "ycoords": "326"
            }, {
                "date": "2023-01-18T21:00:00.000Z",
                "xcoords": 1.375,
                "ycoords": "298"
            }, {
                "date": "2023-01-19T21:00:00.000Z",
                "xcoords": 1.291625,
                "ycoords": "329"
            }, {
                "date": "2023-01-20T21:00:00.000Z",
                "xcoords": 2.916625,
                "ycoords": "257"
            }, {
                "date": "2023-01-21T21:00:00.000Z",
                "xcoords": 2.1248750000000003,
                "ycoords": "237"
            }, {
                "date": "2023-01-22T21:00:00.000Z",
                "xcoords": 1.541625,
                "ycoords": "295"
            }, {
                "date": "2023-01-23T21:00:00.000Z",
                "xcoords": 0.83325,
                "ycoords": "278"
            }, {
                "date": "2023-01-24T21:00:00.000Z",
                "xcoords": 1.33325,
                "ycoords": "299"
            }, {
                "date": "2023-01-25T21:00:00.000Z",
                "xcoords": 2.2085,
                "ycoords": "298"
            }, {
                "date": "2023-01-26T21:00:00.000Z",
                "xcoords": 1.875,
                "ycoords": "323"
            }, {
                "date": "2023-01-27T21:00:00.000Z",
                "xcoords": 2.2083749999999998,
                "ycoords": "270"
            }, {
                "date": "2023-01-28T21:00:00.000Z",
                "xcoords": 1.083375,
                "ycoords": "249"
            }, {
                "date": "2023-01-29T21:00:00.000Z",
                "xcoords": 1.000125,
                "ycoords": "269"
            }, {
                "date": "2023-01-30T21:00:00.000Z",
                "xcoords": 1.875,
                "ycoords": "280"
            }, {
                "date": "2023-01-31T21:00:00.000Z",
                "xcoords": 1.20825,
                "ycoords": "278"
            }, {
                "date": "2023-02-01T21:00:00.000Z",
                "xcoords": 0.916625,
                "ycoords": "252"
            }, {
                "date": "2023-02-02T21:00:00.000Z",
                "xcoords": 1.66675,
                "ycoords": "299"
            }, {
                "date": "2023-02-03T21:00:00.000Z",
                "xcoords": 1.125125,
                "ycoords": "263"
            }, {
                "date": "2023-02-04T21:00:00.000Z",
                "xcoords": 1.124875,
                "ycoords": "222"
            }, {
                "date": "2023-02-05T21:00:00.000Z",
                "xcoords": 3.083375,
                "ycoords": "280"
            }, {
                "date": "2023-02-06T21:00:00.000Z",
                "xcoords": 3.2917500000000004,
                "ycoords": "251"
            }, {
                "date": "2023-02-07T21:00:00.000Z",
                "xcoords": 3.2082499999999996,
                "ycoords": "232"
            }, {
                "date": "2023-02-08T21:00:00.000Z",
                "xcoords": 3.2498749999999994,
                "ycoords": "259"
            }, {
                "date": "2023-02-09T21:00:00.000Z",
                "xcoords": 2.958375,
                "ycoords": "261"
            }, {
                "date": "2023-02-10T21:00:00.000Z",
                "xcoords": 1.9165,
                "ycoords": "267"
            }, {
                "date": "2023-02-11T21:00:00.000Z",
                "xcoords": 1.875125,
                "ycoords": "258"
            }, {
                "date": "2023-02-12T21:00:00.000Z",
                "xcoords": 0.9167500000000001,
                "ycoords": "288"
            }, {
                "date": "2023-02-13T21:00:00.000Z",
                "xcoords": 1.499875,
                "ycoords": "314"
            }, {
                "date": "2023-02-14T21:00:00.000Z",
                "xcoords": 3.8748749999999994,
                "ycoords": "257"
            }, {
                "date": "2023-02-15T21:00:00.000Z",
                "xcoords": 3.291499999999999,
                "ycoords": "267"
            }, {
                "date": "2023-02-16T21:00:00.000Z",
                "xcoords": 1.375,
                "ycoords": "289"
            }, {
                "date": "2023-02-17T21:00:00.000Z",
                "xcoords": 1.5,
                "ycoords": "275"
            }, {
                "date": "2023-02-18T21:00:00.000Z",
                "xcoords": 1.45825,
                "ycoords": "239"
            }, {
                "date": "2023-02-19T21:00:00.000Z",
                "xcoords": 1.708375,
                "ycoords": "287"
            }, {
                "date": "2023-02-20T21:00:00.000Z",
                "xcoords": 2.666625,
                "ycoords": "300"
            }, {
                "date": "2023-02-21T21:00:00.000Z",
                "xcoords": 1.624875,
                "ycoords": "334"
            }, {
                "date": "2023-02-22T21:00:00.000Z",
                "xcoords": 3.4167500000000004,
                "ycoords": "247"
            }, {
                "date": "2023-02-23T21:00:00.000Z",
                "xcoords": 1.166625,
                "ycoords": "238"
            }, {
                "date": "2023-02-24T21:00:00.000Z",
                "xcoords": 2.041625,
                "ycoords": "277"
            }, {
                "date": "2023-02-25T21:00:00.000Z",
                "xcoords": 3.416625,
                "ycoords": "259"
            }, {
                "date": "2023-02-26T21:00:00.000Z",
                "xcoords": 6.208375,
                "ycoords": "284"
            }, {
                "date": "2023-02-27T21:00:00.000Z",
                "xcoords": 3.458375,
                "ycoords": "220"
            }, {
                "date": "2023-02-28T21:00:00.000Z",
                "xcoords": 1.75,
                "ycoords": "251"
            }, {
                "date": "2023-03-01T21:00:00.000Z",
                "xcoords": 1.91675,
                "ycoords": "260"
            }, {
                "date": "2023-03-02T21:00:00.000Z",
                "xcoords": 3.416625,
                "ycoords": "264"
            }, {
                "date": "2023-03-03T21:00:00.000Z",
                "xcoords": 3.0832499999999996,
                "ycoords": "255"
            }, {
                "date": "2023-03-04T21:00:00.000Z",
                "xcoords": 3.541625,
                "ycoords": "246"
            }, {
                "date": "2023-03-05T21:00:00.000Z",
                "xcoords": 2.916875,
                "ycoords": "259"
            }, {
                "date": "2023-03-06T21:00:00.000Z",
                "xcoords": 1.958375,
                "ycoords": "325"
            }, {
                "date": "2023-03-07T21:00:00.000Z",
                "xcoords": 1.70825,
                "ycoords": "231"
            }, {
                "date": "2023-03-08T21:00:00.000Z",
                "xcoords": 2.8332499999999996,
                "ycoords": "280"
            }, {
                "date": "2023-03-09T21:00:00.000Z",
                "xcoords": 2,
                "ycoords": "275"
            }, {
                "date": "2023-03-10T21:00:00.000Z",
                "xcoords": 1.458375,
                "ycoords": "257"
            }, {
                "date": "2023-03-11T21:00:00.000Z",
                "xcoords": 1.583375,
                "ycoords": "224"
            }, {
                "date": "2023-03-12T21:00:00.000Z",
                "xcoords": 0.49987500000000007,
                "ycoords": "283"
            }, {
                "date": "2023-03-13T21:00:00.000Z",
                "xcoords": 3.291625,
                "ycoords": "267"
            }, {
                "date": "2023-03-14T21:00:00.000Z",
                "xcoords": 3.7501249999999997,
                "ycoords": "246"
            }, {
                "date": "2023-03-15T21:00:00.000Z",
                "xcoords": 1.125,
                "ycoords": "233"
            }, {
                "date": "2023-03-16T21:00:00.000Z",
                "xcoords": 1.374875,
                "ycoords": "320"
            }, {
                "date": "2023-03-17T21:00:00.000Z",
                "xcoords": 2.0415,
                "ycoords": "299"
            }, {
                "date": "2023-03-18T21:00:00.000Z",
                "xcoords": 2.083375,
                "ycoords": "207"
            }, {
                "date": "2023-03-19T21:00:00.000Z",
                "xcoords": 2.1248750000000003,
                "ycoords": "251"
            }, {
                "date": "2023-03-20T21:00:00.000Z",
                "xcoords": 1.70825,
                "ycoords": "229"
            }, {
                "date": "2023-03-21T21:00:00.000Z",
                "xcoords": 2.8332499999999996,
                "ycoords": "268"
            }, {
                "date": "2023-03-22T21:00:00.000Z",
                "xcoords": 4.3335,
                "ycoords": "272"
            }, {
                "date": "2023-03-23T21:00:00.000Z",
                "xcoords": 5.0832500000000005,
                "ycoords": "283"
            }, {
                "date": "2023-03-24T21:00:00.000Z",
                "xcoords": 2.7917499999999995,
                "ycoords": "241"
            }, {
                "date": "2023-03-25T21:00:00.000Z",
                "xcoords": 1.7086249999999998,
                "ycoords": "211"
            }, {
                "date": "2023-03-26T21:00:00.000Z",
                "xcoords": 0.5415,
                "ycoords": "255"
            }, {
                "date": "2023-03-27T21:00:00.000Z",
                "xcoords": 0.875,
                "ycoords": "269"
            }, {
                "date": "2023-03-28T21:00:00.000Z",
                "xcoords": 1.250125,
                "ycoords": "241"
            }, {
                "date": "2023-03-29T21:00:00.000Z",
                "xcoords": 3.083375,
                "ycoords": "254"
            }, {
                "date": "2023-03-30T21:00:00.000Z",
                "xcoords": 3.333125,
                "ycoords": "283"
            }, {
                "date": "2023-03-31T21:00:00.000Z",
                "xcoords": 2.6667500000000004,
                "ycoords": "249"
            }, {
                "date": "2023-04-01T21:00:00.000Z",
                "xcoords": 2.708375,
                "ycoords": "263"
            }, {
                "date": "2023-04-02T21:00:00.000Z",
                "xcoords": 2.5,
                "ycoords": "282"
            }, {
                "date": "2023-04-03T21:00:00.000Z",
                "xcoords": 2.625,
                "ycoords": "286"
            }, {
                "date": "2023-04-04T21:00:00.000Z",
                "xcoords": 2.458375,
                "ycoords": "280"
            }, {
                "date": "2023-04-05T21:00:00.000Z",
                "xcoords": 1.749875,
                "ycoords": "269"
            }, {
                "date": "2023-04-06T21:00:00.000Z",
                "xcoords": 1.875125,
                "ycoords": "294"
            }, {
                "date": "2023-04-07T21:00:00.000Z",
                "xcoords": 1.25,
                "ycoords": "296"
            }, {
                "date": "2023-04-08T21:00:00.000Z",
                "xcoords": 1.416625,
                "ycoords": "317"
            }, {
                "date": "2023-04-09T21:00:00.000Z",
                "xcoords": 2.541625,
                "ycoords": "286"
            }, {
                "date": "2023-04-10T21:00:00.000Z",
                "xcoords": 1.08325,
                "ycoords": "308"
            }, {
                "date": "2023-04-11T21:00:00.000Z",
                "xcoords": 0.6248750000000001,
                "ycoords": "321"
            }, {
                "date": "2023-04-12T21:00:00.000Z",
                "xcoords": 1.375,
                "ycoords": "261"
            }, {
                "date": "2023-04-13T21:00:00.000Z",
                "xcoords": 1.45825,
                "ycoords": "343"
            }, {
                "date": "2023-04-14T21:00:00.000Z",
                "xcoords": 1.83325,
                "ycoords": "321"
            }, {
                "date": "2023-04-15T21:00:00.000Z",
                "xcoords": 0.9167500000000001,
                "ycoords": "315"
            }, {
                "date": "2023-04-16T21:00:00.000Z",
                "xcoords": 1.1665,
                "ycoords": "334"
            }, {
                "date": "2023-04-17T21:00:00.000Z",
                "xcoords": 2.0833749999999998,
                "ycoords": "297"
            }, {
                "date": "2023-04-18T21:00:00.000Z",
                "xcoords": 1.958375,
                "ycoords": "299"
            }, {
                "date": "2023-04-19T21:00:00.000Z",
                "xcoords": 1.083375,
                "ycoords": "306"
            }, {
                "date": "2023-04-20T21:00:00.000Z",
                "xcoords": 2.041625,
                "ycoords": "341"
            }, {
                "date": "2023-04-21T21:00:00.000Z",
                "xcoords": 1.4997500000000001,
                "ycoords": "323"
            }, {
                "date": "2023-04-22T21:00:00.000Z",
                "xcoords": 4.2915,
                "ycoords": "318"
            }, {
                "date": "2023-04-23T21:00:00.000Z",
                "xcoords": 4.91675,
                "ycoords": "321"
            }, {
                "date": "2023-04-24T21:00:00.000Z",
                "xcoords": 1.7498749999999998,
                "ycoords": "385"
            }, {
                "date": "2023-04-25T21:00:00.000Z",
                "xcoords": 2.8748750000000003,
                "ycoords": "334"
            }, {
                "date": "2023-04-26T21:00:00.000Z",
                "xcoords": 3.5,
                "ycoords": "357"
            }, {
                "date": "2023-04-27T21:00:00.000Z",
                "xcoords": 3.291625,
                "ycoords": "353"
            }, {
                "date": "2023-04-28T21:00:00.000Z",
                "xcoords": 3.4165,
                "ycoords": "357"
            }, {
                "date": "2023-04-29T21:00:00.000Z",
                "xcoords": 1.958375,
                "ycoords": "312"
            }, {
                "date": "2023-04-30T21:00:00.000Z",
                "xcoords": 2.1248750000000003,
                "ycoords": "294"
            }, {
                "date": "2023-05-01T21:00:00.000Z",
                "xcoords": 1.8335,
                "ycoords": "301"
            }, {
                "date": "2023-05-02T21:00:00.000Z",
                "xcoords": 0.666625,
                "ycoords": "296"
            }, {
                "date": "2023-05-03T21:00:00.000Z",
                "xcoords": 1.375,
                "ycoords": "314"
            }, {
                "date": "2023-05-04T21:00:00.000Z",
                "xcoords": 0.7085,
                "ycoords": "370"
            }, {
                "date": "2023-05-05T21:00:00.000Z",
                "xcoords": 3.791625,
                "ycoords": "357"
            }, {
                "date": "2023-05-06T21:00:00.000Z",
                "xcoords": 2.125,
                "ycoords": "316"
            }, {
                "date": "2023-05-07T21:00:00.000Z",
                "xcoords": 2.666625,
                "ycoords": "309"
            }, {
                "date": "2023-05-08T21:00:00.000Z",
                "xcoords": 2.375,
                "ycoords": "307"
            }, {
                "date": "2023-05-09T21:00:00.000Z",
                "xcoords": 3.5417500000000004,
                "ycoords": "298"
            }, {
                "date": "2023-05-10T21:00:00.000Z",
                "xcoords": 2.04175,
                "ycoords": "325"
            }, {
                "date": "2023-05-11T21:00:00.000Z",
                "xcoords": 3.0415,
                "ycoords": "361"
            }, {
                "date": "2023-05-12T21:00:00.000Z",
                "xcoords": 2.291625,
                "ycoords": "363"
            }, {
                "date": "2023-05-13T21:00:00.000Z",
                "xcoords": 1.791625,
                "ycoords": "323"
            }, {
                "date": "2023-05-14T21:00:00.000Z",
                "xcoords": 1.08325,
                "ycoords": "363"
            }, {
                "date": "2023-05-15T21:00:00.000Z",
                "xcoords": 1.70825,
                "ycoords": "356"
            }, {
                "date": "2023-05-16T21:00:00.000Z",
                "xcoords": 0.6251249999999999,
                "ycoords": "365"
            }, {
                "date": "2023-05-17T21:00:00.000Z",
                "xcoords": 0.2915,
                "ycoords": "386"
            }, {
                "date": "2023-05-18T21:00:00.000Z",
                "xcoords": 1.416625,
                "ycoords": "388"
            }, {
                "date": "2023-05-19T21:00:00.000Z",
                "xcoords": 4.0417499999999995,
                "ycoords": "391"
            }, {
                "date": "2023-05-20T21:00:00.000Z",
                "xcoords": 3.208375,
                "ycoords": "372"
            }, {
                "date": "2023-05-21T21:00:00.000Z",
                "xcoords": 3.375,
                "ycoords": "376"
            }, {
                "date": "2023-05-22T21:00:00.000Z",
                "xcoords": 2.3751249999999997,
                "ycoords": "357"
            }, {
                "date": "2023-05-23T21:00:00.000Z",
                "xcoords": 2.291625,
                "ycoords": "366"
            }, {
                "date": "2023-05-24T21:00:00.000Z",
                "xcoords": 2.4167500000000004,
                "ycoords": "349"
            }, {
                "date": "2023-05-25T21:00:00.000Z",
                "xcoords": 1.333375,
                "ycoords": "433"
            }, {
                "date": "2023-05-26T21:00:00.000Z",
                "xcoords": 0.8333750000000001,
                "ycoords": "382"
            }, {
                "date": "2023-05-27T21:00:00.000Z",
                "xcoords": 2.16675,
                "ycoords": "401"
            }, {
                "date": "2023-05-28T21:00:00.000Z",
                "xcoords": 0.75,
                "ycoords": "385"
            }, {
                "date": "2023-05-29T21:00:00.000Z",
                "xcoords": 0.958375,
                "ycoords": "348"
            }, {
                "date": "2023-05-30T21:00:00.000Z",
                "xcoords": 2.2498750000000003,
                "ycoords": "371"
            }, {
                "date": "2023-05-31T21:00:00.000Z",
                "xcoords": 2.666625,
                "ycoords": "368"
            }, {
                "date": "2023-06-01T21:00:00.000Z",
                "xcoords": 1.16675,
                "ycoords": "429"
            }, {
                "date": "2023-06-02T21:00:00.000Z",
                "xcoords": 0.750125,
                "ycoords": "393"
            }, {
                "date": "2023-06-03T21:00:00.000Z",
                "xcoords": 1.999875,
                "ycoords": "413"
            }, {
                "date": "2023-06-04T21:00:00.000Z",
                "xcoords": 0.958375,
                "ycoords": "362"
            }, {
                "date": "2023-06-05T21:00:00.000Z",
                "xcoords": 1.333375,
                "ycoords": "367"
            }, {
                "date": "2023-06-06T21:00:00.000Z",
                "xcoords": 0.75,
                "ycoords": "376"
            }, {
                "date": "2023-06-07T21:00:00.000Z",
                "xcoords": 1.166625,
                "ycoords": "383"
            }, {
                "date": "2023-06-08T21:00:00.000Z",
                "xcoords": 0.708375,
                "ycoords": "419"
            }, {
                "date": "2023-06-09T21:00:00.000Z",
                "xcoords": 0.9165,
                "ycoords": "375"
            }, {
                "date": "2023-06-10T21:00:00.000Z",
                "xcoords": 2.08325,
                "ycoords": "402"
            }, {
                "date": "2023-06-11T21:00:00.000Z",
                "xcoords": 1.4997500000000001,
                "ycoords": "355"
            }, {
                "date": "2023-06-12T21:00:00.000Z",
                "xcoords": 1.2915,
                "ycoords": "354"
            }, {
                "date": "2023-06-13T21:00:00.000Z",
                "xcoords": 0.75,
                "ycoords": "376"
            }, {
                "date": "2023-06-14T21:00:00.000Z",
                "xcoords": 3.208125,
                "ycoords": "364"
            }, {
                "date": "2023-06-15T21:00:00.000Z",
                "xcoords": 4.000125,
                "ycoords": "424"
            }, {
                "date": "2023-06-16T21:00:00.000Z",
                "xcoords": 2,
                "ycoords": "427"
            }, {
                "date": "2023-06-17T21:00:00.000Z",
                "xcoords": 2.125,
                "ycoords": "405"
            }, {
                "date": "2023-06-18T21:00:00.000Z",
                "xcoords": 2.3748750000000003,
                "ycoords": "386"
            }, {
                "date": "2023-06-19T21:00:00.000Z",
                "xcoords": 2.0001249999999997,
                "ycoords": "404"
            }, {
                "date": "2023-06-20T21:00:00.000Z",
                "xcoords": 1.458375,
                "ycoords": "357"
            }, {
                "date": "2023-06-21T21:00:00.000Z",
                "xcoords": 2.1251249999999997,
                "ycoords": "363"
            }, {
                "date": "2023-06-22T21:00:00.000Z",
                "xcoords": 2.1248750000000003,
                "ycoords": "402"
            }, {
                "date": "2023-06-23T21:00:00.000Z",
                "xcoords": 2.916625,
                "ycoords": "384"
            }, {
                "date": "2023-06-24T21:00:00.000Z",
                "xcoords": 2.7082500000000005,
                "ycoords": "370"
            }, {
                "date": "2023-06-25T21:00:00.000Z",
                "xcoords": 2.416625,
                "ycoords": "385"
            }, {
                "date": "2023-06-26T21:00:00.000Z",
                "xcoords": 2,
                "ycoords": "402"
            }, {
                "date": "2023-06-27T21:00:00.000Z",
                "xcoords": 1.9165,
                "ycoords": "386"
            }, {
                "date": "2023-06-28T21:00:00.000Z",
                "xcoords": 3.0417499999999995,
                "ycoords": "394"
            }, {
                "date": "2023-06-29T21:00:00.000Z",
                "xcoords": 1.54175,
                "ycoords": "430"
            }, {
                "date": "2023-06-30T21:00:00.000Z",
                "xcoords": 1.125125,
                "ycoords": "415"
            }, {
                "date": "2023-07-01T21:00:00.000Z",
                "xcoords": 1,
                "ycoords": "414"
            }, {
                "date": "2023-07-02T21:00:00.000Z",
                "xcoords": 0.958375,
                "ycoords": "429"
            }, {
                "date": "2023-07-03T21:00:00.000Z",
                "xcoords": 0.791875,
                "ycoords": "403"
            }, {
                "date": "2023-07-04T21:00:00.000Z",
                "xcoords": 1.33325,
                "ycoords": "401"
            }, {
                "date": "2023-07-05T21:00:00.000Z",
                "xcoords": 2.333375,
                "ycoords": "408"
            }, {
                "date": "2023-07-06T21:00:00.000Z",
                "xcoords": 3.2085,
                "ycoords": "461"
            }, {
                "date": "2023-07-07T21:00:00.000Z",
                "xcoords": 1.2915,
                "ycoords": "464"
            }, {
                "date": "2023-07-08T21:00:00.000Z",
                "xcoords": 0.7082499999999999,
                "ycoords": "416"
            }, {
                "date": "2023-07-09T21:00:00.000Z",
                "xcoords": 0.95825,
                "ycoords": "412"
            }, {
                "date": "2023-07-10T21:00:00.000Z",
                "xcoords": 1.7085,
                "ycoords": "375"
            }, {
                "date": "2023-07-11T21:00:00.000Z",
                "xcoords": 1.5415,
                "ycoords": "379"
            }, {
                "date": "2023-07-12T21:00:00.000Z",
                "xcoords": 1.625,
                "ycoords": "388"
            }, {
                "date": "2023-07-13T21:00:00.000Z",
                "xcoords": 3.333375,
                "ycoords": "414"
            }, {
                "date": "2023-07-14T21:00:00.000Z",
                "xcoords": 1.5835,
                "ycoords": "432"
            }, {
                "date": "2023-07-15T21:00:00.000Z",
                "xcoords": 1.333375,
                "ycoords": "429"
            }, {
                "date": "2023-07-16T21:00:00.000Z",
                "xcoords": 3.2917499999999995,
                "ycoords": "376"
            }, {
                "date": "2023-07-17T21:00:00.000Z",
                "xcoords": 2.583375,
                "ycoords": "375"
            }, {
                "date": "2023-07-18T21:00:00.000Z",
                "xcoords": 0.958375,
                "ycoords": "379"
            }, {
                "date": "2023-07-19T21:00:00.000Z",
                "xcoords": 1.7917500000000002,
                "ycoords": "404"
            }, {
                "date": "2023-07-20T21:00:00.000Z",
                "xcoords": 2.2915,
                "ycoords": "436"
            }, {
                "date": "2023-07-21T21:00:00.000Z",
                "xcoords": 1.833375,
                "ycoords": "492"
            }, {
                "date": "2023-07-22T21:00:00.000Z",
                "xcoords": 1.45825,
                "ycoords": "393"
            }, {
                "date": "2023-07-23T21:00:00.000Z",
                "xcoords": 1.5,
                "ycoords": "405"
            }, {
                "date": "2023-07-24T21:00:00.000Z",
                "xcoords": 1.7917500000000002,
                "ycoords": "403"
            }, {
                "date": "2023-07-25T21:00:00.000Z",
                "xcoords": 3.291625,
                "ycoords": "433"
            }, {
                "date": "2023-07-26T21:00:00.000Z",
                "xcoords": 1.583375,
                "ycoords": "411"
            }, {
                "date": "2023-07-27T21:00:00.000Z",
                "xcoords": 1.2497500000000001,
                "ycoords": "505"
            }, {
                "date": "2023-07-28T21:00:00.000Z",
                "xcoords": 1.95825,
                "ycoords": "468"
            }, {
                "date": "2023-07-29T21:00:00.000Z",
                "xcoords": 1.91675,
                "ycoords": "416"
            }, {
                "date": "2023-07-30T21:00:00.000Z",
                "xcoords": 1.416625,
                "ycoords": "433"
            }, {
                "date": "2023-07-31T21:00:00.000Z",
                "xcoords": 1.958375,
                "ycoords": "484"
            }, {
                "date": "2023-08-01T21:00:00.000Z",
                "xcoords": 2.333375,
                "ycoords": "463"
            }, {
                "date": "2023-08-02T21:00:00.000Z",
                "xcoords": 1.249875,
                "ycoords": "437"
            }, {
                "date": "2023-08-03T21:00:00.000Z",
                "xcoords": 2.25,
                "ycoords": "520"
            }, {
                "date": "2023-08-04T21:00:00.000Z",
                "xcoords": 3.458375,
                "ycoords": "497"
            }, {
                "date": "2023-08-05T21:00:00.000Z",
                "xcoords": 0.33325000000000005,
                "ycoords": "481"
            }, {
                "date": "2023-08-06T21:00:00.000Z",
                "xcoords": 2.041625,
                "ycoords": "484"
            }, {
                "date": "2023-08-07T21:00:00.000Z",
                "xcoords": 1.5,
                "ycoords": "438"
            }, {
                "date": "2023-08-08T21:00:00.000Z",
                "xcoords": 1.583375,
                "ycoords": "441"
            }, {
                "date": "2023-08-09T21:00:00.000Z",
                "xcoords": 1.625,
                "ycoords": "415"
            }, {
                "date": "2023-08-10T21:00:00.000Z",
                "xcoords": 0.833375,
                "ycoords": "517"
            }, {
                "date": "2023-08-11T21:00:00.000Z",
                "xcoords": 1.666625,
                "ycoords": "472"
            }, {
                "date": "2023-08-12T21:00:00.000Z",
                "xcoords": 1.000125,
                "ycoords": "439"
            }, {
                "date": "2023-08-13T21:00:00.000Z",
                "xcoords": 0.9581250000000001,
                "ycoords": "404"
            }, {
                "date": "2023-08-14T21:00:00.000Z",
                "xcoords": 0.6248750000000001,
                "ycoords": "436"
            }, {
                "date": "2023-08-15T21:00:00.000Z",
                "xcoords": 1.583375,
                "ycoords": "481"
            }, {
                "date": "2023-08-16T21:00:00.000Z",
                "xcoords": 1.5,
                "ycoords": "480"
            }, {
                "date": "2023-08-17T21:00:00.000Z",
                "xcoords": 2.3748750000000003,
                "ycoords": "478"
            }, {
                "date": "2023-08-18T21:00:00.000Z",
                "xcoords": 1.7081250000000001,
                "ycoords": "497"
            }, {
                "date": "2023-08-19T21:00:00.000Z",
                "xcoords": 1.95825,
                "ycoords": "400"
            }, {
                "date": "2023-08-20T21:00:00.000Z",
                "xcoords": 2,
                "ycoords": "439"
            }, {
                "date": "2023-08-21T21:00:00.000Z",
                "xcoords": 1.541625,
                "ycoords": "408"
            }, {
                "date": "2023-08-22T21:00:00.000Z",
                "xcoords": 0.666625,
                "ycoords": "428"
            }, {
                "date": "2023-08-23T21:00:00.000Z",
                "xcoords": 1.5418749999999999,
                "ycoords": "394"
            }, {
                "date": "2023-08-24T21:00:00.000Z",
                "xcoords": 0.875,
                "ycoords": "428"
            }, {
                "date": "2023-08-25T21:00:00.000Z",
                "xcoords": 1.625,
                "ycoords": "429"
            }, {
                "date": "2023-08-26T21:00:00.000Z",
                "xcoords": 2.1665,
                "ycoords": "450"
            }, {
                "date": "2023-08-27T21:00:00.000Z",
                "xcoords": 1.54175,
                "ycoords": "422"
            }, {
                "date": "2023-08-28T21:00:00.000Z",
                "xcoords": 0.95825,
                "ycoords": "429"
            }, {
                "date": "2023-08-29T21:00:00.000Z",
                "xcoords": 1.249875,
                "ycoords": "443"
            }, {
                "date": "2023-08-30T21:00:00.000Z",
                "xcoords": 1.41675,
                "ycoords": "425"
            }, {
                "date": "2023-08-31T21:00:00.000Z",
                "xcoords": 2.6251249999999997,
                "ycoords": "537"
            }, {
                "date": "2023-09-01T21:00:00.000Z",
                "xcoords": 4.499874999999999,
                "ycoords": "438"
            }, {
                "date": "2023-09-02T21:00:00.000Z",
                "xcoords": 3.4165,
                "ycoords": "393"
            }, {
                "date": "2023-09-03T21:00:00.000Z",
                "xcoords": 1.541625,
                "ycoords": "404"
            }, {
                "date": "2023-09-04T21:00:00.000Z",
                "xcoords": 1.7085,
                "ycoords": "367"
            }, {
                "date": "2023-09-05T21:00:00.000Z",
                "xcoords": 1.458375,
                "ycoords": "404"
            }, {
                "date": "2023-09-06T21:00:00.000Z",
                "xcoords": 1.3335,
                "ycoords": "403"
            }, {
                "date": "2023-09-07T21:00:00.000Z",
                "xcoords": 1.249875,
                "ycoords": "446"
            }, {
                "date": "2023-09-08T21:00:00.000Z",
                "xcoords": 1.75,
                "ycoords": "415"
            }, {
                "date": "2023-09-09T21:00:00.000Z",
                "xcoords": 0.541625,
                "ycoords": "420"
            }, {
                "date": "2023-09-10T21:00:00.000Z",
                "xcoords": 1.375,
                "ycoords": "354"
            }, {
                "date": "2023-09-11T21:00:00.000Z",
                "xcoords": 2.875,
                "ycoords": "417"
            }, {
                "date": "2023-09-12T21:00:00.000Z",
                "xcoords": 2.9167500000000004,
                "ycoords": "432"
            }, {
                "date": "2023-09-13T21:00:00.000Z",
                "xcoords": 2.9165,
                "ycoords": "427"
            }, {
                "date": "2023-09-14T21:00:00.000Z",
                "xcoords": 1.583375,
                "ycoords": "489"
            }, {
                "date": "2023-09-15T21:00:00.000Z",
                "xcoords": 1.291625,
                "ycoords": "502"
            }, {
                "date": "2023-09-16T21:00:00.000Z",
                "xcoords": 2.916625,
                "ycoords": "447"
            }, {
                "date": "2023-09-17T21:00:00.000Z",
                "xcoords": 4,
                "ycoords": "464"
            }, {
                "date": "2023-09-18T21:00:00.000Z",
                "xcoords": 4.666625,
                "ycoords": "423"
            }, {
                "date": "2023-09-19T21:00:00.000Z",
                "xcoords": 2.916625,
                "ycoords": "406"
            }, {
                "date": "2023-09-20T21:00:00.000Z",
                "xcoords": 2.16675,
                "ycoords": "433"
            }, {
                "date": "2023-09-21T21:00:00.000Z",
                "xcoords": 2.04175,
                "ycoords": "504"
            }, {
                "date": "2023-09-22T21:00:00.000Z",
                "xcoords": 2.083375,
                "ycoords": "534"
            }, {
                "date": "2023-09-23T21:00:00.000Z",
                "xcoords": 2.54175,
                "ycoords": "453"
            }, {
                "date": "2023-09-24T21:00:00.000Z",
                "xcoords": 3.4582499999999996,
                "ycoords": "446"
            }, {
                "date": "2023-09-25T21:00:00.000Z",
                "xcoords": 3.916625,
                "ycoords": "432"
            }, {
                "date": "2023-09-26T21:00:00.000Z",
                "xcoords": 2.708375,
                "ycoords": "432"
            }, {
                "date": "2023-09-27T21:00:00.000Z",
                "xcoords": 1.083375,
                "ycoords": "404"
            }, {
                "date": "2023-09-28T21:00:00.000Z",
                "xcoords": 2.2085000000000004,
                "ycoords": "471"
            }, {
                "date": "2023-09-29T21:00:00.000Z",
                "xcoords": 2.12475,
                "ycoords": "469"
            }, {
                "date": "2023-09-30T21:00:00.000Z",
                "xcoords": 1.8335,
                "ycoords": "405"
            }, {
                "date": "2023-10-01T21:00:00.000Z",
                "xcoords": 1.83325,
                "ycoords": "420"
            }, {
                "date": "2023-10-02T21:00:00.000Z",
                "xcoords": 1.666625,
                "ycoords": "389"
            }, {
                "date": "2023-10-03T21:00:00.000Z",
                "xcoords": 2.29175,
                "ycoords": "414"
            }, {
                "date": "2023-10-04T21:00:00.000Z",
                "xcoords": 2.4167500000000004,
                "ycoords": "433"
            }, {
                "date": "2023-10-05T21:00:00.000Z",
                "xcoords": 1.749875,
                "ycoords": "514"
            }, {
                "date": "2023-10-06T21:00:00.000Z",
                "xcoords": 0.95825,
                "ycoords": "493"
            }, {
                "date": "2023-10-07T21:00:00.000Z",
                "xcoords": 1.58325,
                "ycoords": "393"
            }, {
                "date": "2023-10-08T21:00:00.000Z",
                "xcoords": 1.874875,
                "ycoords": "396"
            }, {
                "date": "2023-10-09T21:00:00.000Z",
                "xcoords": 0.708375,
                "ycoords": "383"
            }, {
                "date": "2023-10-10T21:00:00.000Z",
                "xcoords": 0.5833750000000001,
                "ycoords": "398"
            }, {
                "date": "2023-10-11T21:00:00.000Z",
                "xcoords": 0.458375,
                "ycoords": "423"
            }, {
                "date": "2023-10-12T21:00:00.000Z",
                "xcoords": 2.5835,
                "ycoords": "494"
            }, {
                "date": "2023-10-13T21:00:00.000Z",
                "xcoords": 1.4165,
                "ycoords": "462"
            }, {
                "date": "2023-10-14T21:00:00.000Z",
                "xcoords": 0.583375,
                "ycoords": "389"
            }, {
                "date": "2023-10-15T21:00:00.000Z",
                "xcoords": 0.49987500000000007,
                "ycoords": "449"
            }, {
                "date": "2023-10-16T21:00:00.000Z",
                "xcoords": 0.249875,
                "ycoords": "393"
            }, {
                "date": "2023-10-17T21:00:00.000Z",
                "xcoords": 2,
                "ycoords": "453"
            }, {
                "date": "2023-10-18T21:00:00.000Z",
                "xcoords": 1.95825,
                "ycoords": "403"
            }, {
                "date": "2023-10-19T21:00:00.000Z",
                "xcoords": 1.708375,
                "ycoords": "471"
            }, {
                "date": "2023-10-20T21:00:00.000Z",
                "xcoords": 3.083375,
                "ycoords": "390"
            }, {
                "date": "2023-10-21T21:00:00.000Z",
                "xcoords": 1.79175,
                "ycoords": "333"
            }, {
                "date": "2023-10-22T21:00:00.000Z",
                "xcoords": 0.249875,
                "ycoords": "397"
            }, {
                "date": "2023-10-23T21:00:00.000Z",
                "xcoords": 0.6251249999999999,
                "ycoords": "384"
            }, {
                "date": "2023-10-24T21:00:00.000Z",
                "xcoords": 0.66675,
                "ycoords": "311"
            }, {
                "date": "2023-10-25T21:00:00.000Z",
                "xcoords": 3.375,
                "ycoords": "378"
            }, {
                "date": "2023-10-26T21:00:00.000Z",
                "xcoords": 2.208375,
                "ycoords": "432"
            }, {
                "date": "2023-10-27T21:00:00.000Z",
                "xcoords": 3.0001249999999997,
                "ycoords": "393"
            }, {
                "date": "2023-10-28T21:00:00.000Z",
                "xcoords": 3.916625,
                "ycoords": "347"
            }, {
                "date": "2023-10-29T21:00:00.000Z",
                "xcoords": 2.4165,
                "ycoords": "385"
            }, {
                "date": "2023-10-30T21:00:00.000Z",
                "xcoords": 1.875,
                "ycoords": "379"
            }, {
                "date": "2023-10-31T21:00:00.000Z",
                "xcoords": 1.958375,
                "ycoords": "376"
            }, {
                "date": "2023-11-01T21:00:00.000Z",
                "xcoords": 1.5,
                "ycoords": "384"
            }, {
                "date": "2023-11-02T21:00:00.000Z",
                "xcoords": 0.5417500000000001,
                "ycoords": "401"
            }, {
                "date": "2023-11-03T21:00:00.000Z",
                "xcoords": 1.9585,
                "ycoords": "370"
            }, {
                "date": "2023-11-04T21:00:00.000Z",
                "xcoords": 4.625125000000001,
                "ycoords": "339"
            }, {
                "date": "2023-11-05T21:00:00.000Z",
                "xcoords": 4.333375,
                "ycoords": "311"
            }, {
                "date": "2023-11-06T21:00:00.000Z",
                "xcoords": 3.125,
                "ycoords": "367"
            }, {
                "date": "2023-11-07T21:00:00.000Z",
                "xcoords": 2.8748750000000003,
                "ycoords": "350"
            }, {
                "date": "2023-11-08T21:00:00.000Z",
                "xcoords": 2.4167500000000004,
                "ycoords": "391"
            }, {
                "date": "2023-11-09T21:00:00.000Z",
                "xcoords": 1.958375,
                "ycoords": "393"
            }, {
                "date": "2023-11-10T21:00:00.000Z",
                "xcoords": 0.958375,
                "ycoords": "348"
            }, {
                "date": "2023-11-11T21:00:00.000Z",
                "xcoords": 1.875,
                "ycoords": "324"
            }, {
                "date": "2023-11-12T21:00:00.000Z",
                "xcoords": 2.416875,
                "ycoords": "439"
            }, {
                "date": "2023-11-13T21:00:00.000Z",
                "xcoords": 1.3335,
                "ycoords": "396"
            }, {
                "date": "2023-11-14T21:00:00.000Z",
                "xcoords": 2.625,
                "ycoords": "424"
            }, {
                "date": "2023-11-15T21:00:00.000Z",
                "xcoords": 1.583375,
                "ycoords": "390"
            }, {
                "date": "2023-11-16T21:00:00.000Z",
                "xcoords": 0.583375,
                "ycoords": "445"
            }, {
                "date": "2023-11-17T21:00:00.000Z",
                "xcoords": 0.291625,
                "ycoords": "344"
            }, {
                "date": "2023-11-18T21:00:00.000Z",
                "xcoords": 0.666625,
                "ycoords": "302"
            }, {
                "date": "2023-11-19T21:00:00.000Z",
                "xcoords": 1.125,
                "ycoords": "369"
            }, {
                "date": "2023-11-20T21:00:00.000Z",
                "xcoords": 3.1248750000000003,
                "ycoords": "334"
            }, {
                "date": "2023-11-21T21:00:00.000Z",
                "xcoords": 3.9998750000000003,
                "ycoords": "376"
            }, {
                "date": "2023-11-22T21:00:00.000Z",
                "xcoords": 1.374875,
                "ycoords": "321"
            }, {
                "date": "2023-11-23T21:00:00.000Z",
                "xcoords": 1.91675,
                "ycoords": "450"
            }, {
                "date": "2023-11-24T21:00:00.000Z",
                "xcoords": 4.29175,
                "ycoords": "314"
            }, {
                "date": "2023-11-25T21:00:00.000Z",
                "xcoords": 1.833375,
                "ycoords": "336"
            }, {
                "date": "2023-11-26T21:00:00.000Z",
                "xcoords": 1.70825,
                "ycoords": "332"
            }, {
                "date": "2023-11-27T21:00:00.000Z",
                "xcoords": 1.666625,
                "ycoords": "310"
            }, {
                "date": "2023-11-28T21:00:00.000Z",
                "xcoords": 1.0418749999999999,
                "ycoords": "347"
            }, {"date": "2023-11-29T21:00:00.000Z", "xcoords": 1.124875, "ycoords": "303"}]
        }
    };
    response.status(200).json(result);
};

const getAnalysisCorrelationCalc = (request, response) => {
    const method = request.body;

    let analysis_factor_id = request.query.analysis_factor_id;
    let start_date = request.query.start_date;
    let end_date = request.query.end_date;
    let factor_dtp_id = request.query.factor_dtp_id;

    if (analysis_factor_id === undefined || analysis_factor_id === '') {
        // let result = {
        //     isSuccess: false,
        //     message: "Can't create query! Need " + 'analysis_factor_id parameter',
        // };
        // response.status(500).json(result);
        analysis_factor_id = 4;
    }
    if (start_date === undefined || end_date === undefined) {

        start_date = '2022-01-01 00:00:00';
        end_date = '2022-01-14 00:00:00';
    }

    // if (start_date === undefined) {
    //     let result = {
    //         isSuccess: false,
    //         message: "Body parameter start_date is wrong",
    //     };
    //     response.status(300).json(result);
    // } else if (end_date === undefined) {
    //     let result = {
    //         isSuccess: false,
    //         message: "Body parameter end_date is wrong",
    //     };
    //     response.status(300).json(result);
    // } else if (analysis_factor_id === undefined) {
    //     let result = {
    //         isSuccess: false,
    //         message: "Body parameter analysis_factor_id is wrong",
    //     };
    //     response.status(300).json(result);
    // } else {

    let factor_dtp_additional = 'and id in (select card_id from factor_ref where factor_id in (select id from factor))';
    if (factor_dtp_id !== undefined) {
        factor_dtp_additional = 'and id in (select card_id from factor_ref where factor_id in (' + factor_dtp_id + '))';
    }

    let query = 'select foo.date, avg(origin_value) as xcoords, ycoords from(SELECT CAST(date as Date) as date, ' +
        'origin_value as origin_value  FROM public."factor_data"where analysis_factor_id in (\'' + analysis_factor_id + '\')  ' +
        'and date between \'' + start_date + '\' and \'' + end_date + '\') as foo inner join ' +
        '(SELECT CAST(date As Date) as date, COUNT(id) as ycoords  FROM public."DTPCard"where region_id in ' +
        '(select id from public."Regions") ' + factor_dtp_additional + ' and date between \'' + start_date + '\' and \'' + end_date + '\' GROUP BY CAST(date As Date) ' +
        'order by date) as bar on foo.date = bar.date group by foo.date, ycoords order by date';
    console.log(query);

    pool.query(query, (error, results) => {

        //Считаем Уравнение линейной регресси Y на X
        //dtp
        let sumX = 0;
        //magnit
        let sumY = 0;
        let count = 0;


        let XY = 0;
        let X2 = 0;
        let Y2 = 0;

        let sumX2 = 0;
        let sumY2 = 0;


        let minX = 0;
        let maxX = 0;
        let prevMaxX = 0;

        if (results.rows.length > 0) {
            minX = results.rows[0].xcoords;
            maxX = results.rows[0].xcoords;
            prevMaxX = results.rows[0].xcoords;
        }

        for (let i = 0; i < results.rows.length; i++) {
            sumX += parseFloat(results.rows[i].xcoords);
            sumY += parseFloat(results.rows[i].ycoords);

            sumX2 += parseFloat(Math.pow(results.rows[i].xcoords, 2));
            sumY2 += parseFloat(Math.pow(results.rows[i].ycoords, 2));

            XY += parseFloat(results.rows[i].xcoords * results.rows[i].ycoords);
            X2 += parseFloat(results.rows[i].xcoords * results.rows[i].xcoords);
            Y2 += parseFloat(results.rows[i].ycoords * results.rows[i].ycoords);
            count++;

            if (results.rows[i].xcoords > maxX) {
                prevMaxX = maxX;
                maxX = results.rows[i].xcoords;
            }

            if (results.rows[i].xcoords < minX) {
                minX = results.rows[i].xcoords;
            }
        }


        let slau1 = X2 + 'a + ' + count + 'b = ' + XY;
        let slau2 = sumX + 'a + ' + count + 'b = ' + sumY;

        let delta = X2 * count - sumX * sumX;

        let deltaA = XY * count - sumY * sumX;

        let a = deltaA / delta;

        let deltaB = X2 * sumY - sumX * XY;

        console.log("Delta b: " + deltaB);

        let b = deltaB / delta;

        let fun = 'y = ' + a + 'x + ' + b;
        let lineX1 = minX;
        let lineX2 = prevMaxX;
        let lineY1 = a * minX + b;
        let lineY2 = a * prevMaxX + b;

        //Линейный коэффициент корреляции. Выборочный линейный коэффициент парной корреляции Пирсона
        let xys = XY / count;
        let xs = sumX / count;
        let ys = sumY / count;

        let sigmaX = Math.sqrt((sumX2 / count) - (Math.pow(xs, 2)));
        let sigmaY = Math.sqrt((sumY2 / count) - (Math.pow(ys, 2)));

        let rxy = (xys - (xs * ys)) / (sigmaX * sigmaY);
        let vivodRXY = 'Линейная корреляционная зависимость количества ДТП от исследуемого фактора ';

        let rxyABS = Math.abs(rxy);
        if (rxyABS > 0 && rxyABS <= 0.1) {
            vivodRXY += 'практически отсутствует';
        } else if (rxyABS > 0.1 && rxyABS <= 0.3) {
            vivodRXY += 'слабая';
        } else if (rxyABS > 0.3 && rxyABS <= 0.5) {
            vivodRXY += 'умеренная';
        } else if (rxyABS > 0.5 && rxyABS <= 0.7) {
            vivodRXY += 'заметная';
        } else if (rxyABS > 0.7 && rxyABS <= 0.9) {
            vivodRXY += 'сильная';
        } else if (rxyABS > 0.0 && rxyABS <= 0.99) {
            vivodRXY += 'очень сильная';
        } else if (rxyABS > 0.99) {
            vivodRXY += 'практически фунциональная';
        }

        //коэффициент детерминации
        let koefDet = Math.pow(rxy, 2).toFixed(9);
        let koefDetPercentage = (koefDet * 100).toFixed(4);
        let koefDetVivod = 'В рамках построенной модели  количество ДТП на ' + koefDetPercentage + '% зависит от выбранного фактора';

        //коэффициент средней эластичности
        let elasticKoef = a * (xs / ys);
        let elasticKoefVivod = '';

        if (elasticKoef <= 1) {
            elasticKoefVivod = 'Зависимый показатель неэластичен к воздействию признака-фактора.';
        } else {
            elasticKoefVivod = 'Зависимый показатель эластичен к воздействию признака-фактора.';
        }

        //Бета-коэффициент
        let betaKoef = a * (sigmaX / sigmaY);
        let betaVivod = 'Количество';

        let betaKoefAbs = Math.abs(betaKoef);

        if (betaKoefAbs > 1) {
            betaVivod = 'Количество средних квадратических отклонений, ' +
                'на которое меняется признак-результат при увеличении прзнака-фактора ' +
                'на одно среднее квадратичное отклонение равно ' + betaKoefAbs + ' и имеет сильное влияние';
        } else if (betaKoefAbs <= 1 && betaKoefAbs > -0.1) {
            betaVivod = 'Количество средних квадратических отклонений, ' +
                'на которое меняется признак-результат при увеличении прзнака-фактора ' +
                'на одно среднее квадратичное отклонение равно ' + betaKoefAbs + ' и имеет умеренное влияние';
        } else {
            betaVivod = 'Количество средних квадратических отклонений, ' +
                'на которое меняется признак-результат при увеличении прзнака-фактора ' +
                'на одно среднее квадратичное отклонение равно ' + betaKoefAbs + ' и имеет практически невосприимчив к фактору';
        }

        let result = {
            isSuccess: true,
            message: "",
            data: {
                sumX: sumX,
                sumY: sumY,
                xy: XY,
                x2: X2,
                y2: Y2,
                slau1: slau1,
                slau2: slau2,
                delta: delta,
                lineX1: lineX1,
                lineX2: lineX2,
                lineY1: lineY1,
                lineY2: lineY2,
                a: a,
                deltaA: deltaA,
                deltaB: deltaB,
                b: b,
                function: fun,
                rxy: rxy,
                vivodRXY: vivodRXY,
                koefDet: koefDet,
                koefDetVivod: koefDetVivod,
                elasticKoef: elasticKoef,
                elasticKoefVivod: elasticKoefVivod,
                betaKoef: betaKoef,
                betaVivod: betaVivod,
                coords: results.rows.sort(function (itemA, itemB) {
                    return itemA.ycoords < itemB.ycoords
                })


            }
        };


        if (error) {
            throw error;
        }

        response.status(200).json(result);
    });
    // }
};

module.exports = {
    pool,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getRegions,
    getVersion,
    getDtpChart,
    getInjuredList,
    getFactorList,
    getDtpChartStub,
    getRegionsStub,
    getFactorListStub,
    getAnalysisFactorList,
    getAnalysisFactorListStub,
    getAnalysisFactorChart,
    getAnalysisFactorChartStub,
    getAnalysisFactor,
    getAnalysisFactorStub,
    createAnalysisFactorStub,
    createAnalysisFactor,
    deleteAnalysisFactor,
    deleteAnalysisFactorStub,
    updateAnalysisFactorStub,
    updateAnalysisFactor,
    getAnalysisMethod,
    getAnalysisMethodStub,
    createAnalysisMethod,
    createAnalysisMethodStub,
    deleteAnalysisMethod,
    deleteAnalysisMethodStub,
    updateAnalysisMethod,
    updateAnalysisMethodStub,
    getAnalysisMethodListStub,
    getAnalysisMethodList,
    getAnalysisCorrelation,
    getAnalysisCorrelationStub,
    getAnalysisCorrelationCalc,
    getAnalysisCorrelationCalcStub,
    writeDataFromFile,
    writeDataFromFileStub,
    deleteFactorData,
    deleteFactorDataStub
};
