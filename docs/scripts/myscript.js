// add your JavaScript/D3 to this file

const correctAnswers = {
    "party-senate": "democrats",
    "party-congress": "republicans",
    "senator-term": 6,
    "least-spent": "Foreign aid",
    "geer-case": 1896
};

const partyOptions = ["Select", "Democrats", "Republicans"];
const spendingOptions = ["Select", "Foreign aid", "Medicare", "National defense", "Social Security"];

function populateSelectOptions(id, options) {
    const selectElement = document.getElementById(id);
    options.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.value = option.toLowerCase();
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const partyOptions = ["Select", "Democrats", "Republicans"];
    const spendingOptions = ["Select", "Foreign aid", "Medicare", "National defense", "Social Security"];

    populateSelectOptions("party-senate", partyOptions);
    populateSelectOptions("party-congress", partyOptions);
    populateSelectOptions("least-spent", spendingOptions);
    populateSelectOptions("party-select", partyOptions);
});

d3.select("#submit-btn").on("click", function() {
    let results = [];

    Object.keys(correctAnswers).forEach(function(key) {
        const userAnswer = d3.select(`#${key}`).property("value");
        const isCorrect = userAnswer.toLowerCase() === correctAnswers[key].toString().toLowerCase();
        results.push(isCorrect ? 1 : 0);
    });

    const score = results.reduce((a, b) => a + b, 0);

    let classification;
    if (score >= 4) {
        classification = "High";
    } else if (score === 3) {
        classification = "Medium";
    } else {
        classification = "Low";
    }

    d3.select("#result")
        .text(`You scored ${score} out of 5. Your level of knowledge is ${classification}.`)
        .append("div")
        .text("Below is the flow of your very own alluvium from the first chart of this project!")
        .append("div")
        .text("Use it to locate yourself in any other plot.");

    createLineChart(results);
});

function createLineChart(results) {
    d3.select("#line-chart").selectAll("*").remove();

    const width = 800;
    const height = 400;

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const xScale = d3.scaleBand()
        .domain(["Q1", "Q2", "Q3", "Q4", "Q5"])
        .range([0, width - 100])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, 1.5])
        .range([height - 50, 50]);

    svg.append("g")
        .attr("transform", "translate(50, " + (height - 50) + ")")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(yScale)
        .tickValues([0.5, 1])
        .tickFormat(d => {
            if (d === 0.5) return "Incorrect";
            if (d === 1) return "Correct";
            return "";
        })
    );

    const partyInput = document.getElementById('party-select').value;

    const lineColor = partyInput === "republicans" ? "red" : (partyInput === "democrats" ? "blue" : "black");

    const lineData = results.map((d, i) => {
        return { x: xScale(["Q1", "Q2", "Q3", "Q4", "Q5"][i]) + 103, y: yScale(d === 1 ? 1 : 0.5) };
    });

    svg.append("path")
        .data([lineData])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => d.x)
            .y(d => d.y)
        );

    svg.selectAll("circle")
        .data(results)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(["Q1", "Q2", "Q3", "Q4", "Q5"][i]) + 103)
        .attr("cy", d => yScale(d === 1 ? 1 : 0.5))
        .attr("r", 6)
        .attr("fill", function(d) {
            if (partyInput === "republicans") {
                return "red";
            } else if (partyInput === "democrats") {
                return "blue";
            } else {
                return "black";
            }
        });
}
