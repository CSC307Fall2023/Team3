const fs = require('fs');


function generateHalloweens() {
    let rows = [];
    const holiday = "Halloween";
    const startMonth = "10";
    const startDate = "01";
    const endMonth = "11";
    const endDate = "01";
    const time = "T00:00:00.0Z";

    for (let i = 0; i < 11; i++) {
        const year = String(i + 2023);  // start with 2023
        const name = [holiday, year].join(" ");
        const start = [year, startMonth, startDate].join("-") + [time];
        const end = [year, endMonth, endDate].join("-") + [time];
        rows.push([name, start, end]);
    }

    return rows;
}


function generateThanksgivings() {
    let rows = [];
    const holiday = "Thanksgiving";
    const startMonth = "11";
    const startDate = "01";
    const endMonth = "12";

    const time = "T00:00:00.0Z";
    // end date based on thanksgiving dates from 2023-2033: https://www.qppstudio.net/global-holidays-observances/us-thanksgiving.htm
    const thanksgivings = [23, 28, 27, 26, 25, 23, 22, 28, 27, 25, 24];

    for (let i = 0; i < 11; i++) {
        const year = String(i + 2023);  // start with 2023
        const name = [holiday, year].join(" ");
        const start = [year, startMonth, startDate].join("-") + [time];
        const end = [year, endMonth, String(thanksgivings[i] + 1)].join("-") + [time];
        rows.push([name, start, end]);
    }

    return rows;
}


function generateChristmases() {
    let rows = [];
    const holiday = "Christmas";
    const startMonth = "12";
    const startDate = "01";
    const endMonth = "01";
    const endDate = "06";
    const time = "T00:00:00.0Z";

    for (let i = 0; i < 11; i++) {
        const year = String(i + 2023);  // start with 2023
        const name = [holiday, year].join(" ");
        const start = [year, startMonth, startDate].join("-") + [time];
        const end = [String(parseInt(year) + 1), endMonth, endDate].join("-") + [time];
        rows.push([name, start, end]);
    }

    return rows;
}


function writeHolidays() {
    let rows = [];
    rows.push(generateHalloweens());
    rows.push(generateThanksgivings());
    rows.push(generateChristmases());

    data = [];
    rows.forEach((element) => element.forEach((x) => data.push(x)));
    console.log(data);

    var file = fs.createWriteStream("db_seeding/seasons.csv");
    file.on("error", function(err) {console.log(err);});
    data.forEach((row) => file.write(row.join(", ") + "\n"));
    file.end();
}


writeHolidays();
