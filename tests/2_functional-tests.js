const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzle_strings = require('../controllers/puzzle-strings').puzzlesAndSolutions;

chai.use(chaiHttp);
suite('Functional Tests', () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
        chai.request(server)
            .post("/api/solve")
            .send({
                puzzle : puzzle_strings[0][0]
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.solution, puzzle_strings[0][1]);
                done();
            })
    });
    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
        chai.request(server)
            .post("/api/solve")
            .send({
                puzzle : ""
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Required field missing");
                done();
            })
    });
    test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
        chai.request(server)
            .post("/api/solve")
            .send({
                puzzle : puzzle_strings[5][0]
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Invalid characters in puzzle");
                done();
            })
    });
    test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
        chai.request(server)
            .post("/api/solve")
            .send({
                puzzle : puzzle_strings[6][0]
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Expected puzzle to be 81 characters long");
                done();
            })
    });
    test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
        chai.request(server)
            .post("/api/solve")
            .send({
                puzzle : puzzle_strings[7][0]
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Puzzle cannot be solved");
                done();
            })
    });
    test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "a2",
                value: 3
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.isTrue(d.body.valid);
                done();
            })
    });
    test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "a2",
                value: 4
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.conflict.length, 1);
                done();
            })
    });
    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "a2",
                value: 5
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.conflict.length, 2);
                done();
            })
    });
    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "a2",
                value: 2
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.conflict.length, 3);
                done();
            })
    });
    test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Required field(s) missing");
                done();
            })
    });
    test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "a2x",
                value: 2
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Invalid coordinate");
                done();
            })
    });
    test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "a2",
                value: 21231231
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Invalid value");
                done();
            })
    });
    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "a2x",
                value: 21231231
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Invalid coordinate");
                done();
            })
    });
    test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
        chai.request(server)
            .post("/api/check")
            .send({
                puzzle : puzzle_strings[0][0],
                coordinate: "A2",
                value: -1
            })
            .end((e, d) => {
                assert.isNull(e);
                assert.equal(d.status, 200);
                assert.equal(d.body.error, "Invalid value");
                done();
            })
    });
});

