// npm modules
import expect from "expect";

// test target with 2 versions, one es6 source and bundled 
import CoerceString from "../src/Coerce";
var CoerceStringBundled = require("../").default;

runTests("ES6", CoerceString);
runTests("Bundled", CoerceStringBundled);

function runTests(name, CoerceStringClass) {
    describe(`${name} - The string mask`, ()=>{

        it("should fill in the pattern until it finds a match", () => {
            const coerce = new CoerceStringClass({ pattern: "hello" });
            expect(
              coerce.string("lo")
            ).toEqual("hello");
        });

        it("should fill in the pattern until it finds a match", () => {
            const coerce = new CoerceStringClass({ pattern: "hello99" });
            expect(
              coerce.string("23")
            ).toEqual("hello23");
        });

        it("should fill in the pattern even if there isn't a match", () => {
            const coerce = new CoerceStringClass({ pattern: "hello" });
            expect(
              coerce.string("5")
            ).toEqual("hello");
        });

        it("should fill in the pattern after all matches have been found", () => {
            const coerce = new CoerceStringClass({ pattern: "hello" });
            expect(
              coerce.string("hel")
            ).toEqual("hello");
        });

        it("should fill in the pattern even if there isn't a match", () => {
            const coerce = new CoerceStringClass({ pattern: "hello" });
            expect(
              coerce.string("z")
            ).toEqual("hello");
        });

        it("shouldn't add characters proceeding the pattern", () => {
            const coerce = new CoerceStringClass({ pattern: "hello" });
            expect(
              coerce.string("hello5")
            ).toEqual("hello");
        });

        it("should allow for repeating at the end of the pattern", () => {
            const coerce = new CoerceStringClass({ pattern: "as+" });
            expect(
              coerce.string("ashello5df")
            ).toEqual("ashello5df");
        });

        it("should move characters that don't match to the closest spot they match the pattern", () => {
            const coerce = new CoerceStringClass({ pattern: "http://+" });
            expect(
              coerce.string("htAtp://")
            ).toEqual("http://A");
        });

        it("should move characters that don't match to the closest spot they match the pattern", () => {
            const coerce = new CoerceStringClass({ pattern: "http://Az" });
            expect(
              coerce.string("htAtp://")
            ).toEqual("http://Az");
        });

        it("should not move characters that don't match, and continue filling out the pattern", () => {
            const coerce = new CoerceStringClass({ pattern: "http://Az" });
            expect(
              coerce.string("htAbtp://")
            ).toEqual("http://Az");
        });

        it("should continue filling in the pattern with matches, not losing any characters when they don't match", () => {
            const coerce = new CoerceStringClass({ pattern: "(999) 999-9999" });
            expect(
              coerce.string("2342342344")
            ).toEqual("(234) 234-2344");
        });

        it("should continue filling in the pattern until the source string runs out", () => {
            const coerce = new CoerceStringClass({ pattern: "(999) 999-9999" });
            expect(
              coerce.string("2342")
            ).toEqual("(234) 2");
            expect(
              coerce.string("2342")
            ).toNotEqual("(234) 2-");
        });

        it("should fill in the pattern when there aren't characters in the string", () => {
            const coerce = new CoerceStringClass({ pattern: "(999) 999-9999" });
            expect(
              coerce.string("")
            ).toEqual("(");
            expect(
              coerce.string("")
            ).toNotEqual("() -");
            expect(
              coerce.string("")
            ).toNotEqual("");
        });

        it("should allow for custom special characters", () => {
            const coerce = new CoerceStringClass({ pattern: "httpA", extend: {A: "a"} });
            expect(
              coerce.string("httpa")
            ).toEqual("httpa");
        });

        it("should allow for conditional characters and skip when there's no match", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://", extend: {S: "s?"} });
            expect(
              coerce.string("https")
            ).toEqual("https://");
            expect(
              coerce.string("httpa")
            ).toEqual("http://");
        });

        it("should fill in the pattern when there aren't characters in the string", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://", extend: {S: "s?"} });
            expect(
              coerce.string("")
            ).toEqual("http");
            expect(
              coerce.string("")
            ).toNotEqual("");
            expect(
              coerce.string("")
            ).toNotEqual("http://");
        });

        it("should fill in the pattern when there aren't characters in the string after a delete", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://", extend: {S: "s?"} });
            expect(
              coerce.string("h")
            ).toEqual("http");
            expect(
              coerce.string("htt")
            ).toEqual("htt");
            expect(
              coerce.string("ht")
            ).toEqual("ht");
            expect(
              coerce.string("h")
            ).toEqual("h");
            expect(
              coerce.string("")
            ).toEqual("http");
        });

        it("should move string characters that don't match conditional characters further down the string", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://+", extend: {S: "s?"} });
            expect(
              coerce.string("httpa")
            ).toEqual("http://a");
        });

        it("should fill in until there's a match, but skip conditionals unless they match", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://+", extend: {S: "s?"} });
            expect(
              coerce.string("abc")
            ).toEqual("http://abc");
        });

        it("should fill in until there's a match, but add conditionals when they match", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://+", extend: {S: "s?"} });
            expect(
              coerce.string("sabc")
            ).toEqual("https://abc");
        });

        it("should allow custom limited types", () => {
            const coerce = new CoerceStringClass({ pattern: "http://5", extend: {5: ".{0,5}"} });
            expect(
              coerce.string("asdfgh")
            ).toEqual("http://asdfg");
        });

        it("shouldn't prefill conditional characters", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://+", extend: {S: "s?"} });
            expect(
              coerce.string("http")
            ).toEqual("http");
        });

        it("should move conditional failures down the string regardless of type", () => {
            const coerce = new CoerceStringClass({ pattern: "httpS://+", extend: {S: "s?"} });
            expect(
              coerce.string("http234")
            ).toEqual("http://234");
        });

        it("should fill in the proceeding non-special character when there isn't a match", () => {
            const coerce = new CoerceStringClass({ pattern: "(999) 999-9999" });
            expect(
              coerce.string("a")
            ).toEqual("(");
        });

        it("should continue filling in the pattern with matches, not losing any characters when they don't match", () => {
            const coerce = new CoerceStringClass({ pattern: "99/99/9999" });
            expect(
              coerce.string("23232344")
            ).toEqual("23/23/2344");
        });

        it("should continue filling in the pattern until the source string runs out", () => {
            const coerce = new CoerceStringClass({ pattern: "99/99/9999" });
            expect(
              coerce.string("234")
            ).toEqual("23/4");
        });

        it("should continue filling in the pattern if there's more pattern to go", () => {
            const coerce = new CoerceStringClass({ pattern: "(999)-999-9999" });
            expect(
              coerce.string("(999)")
            ).toEqual("(999)-");
        });

        it("should continue filling in the pattern if there's more pattern to go", () => {
            const coerce = new CoerceStringClass({ pattern: "999-999-9999" });
            expect(
              coerce.string("999")
            ).toEqual("999-");
        });

        it("should continue filling in the pattern if there's more pattern to go unless it's a special character", () => {
            const coerce = new CoerceStringClass({ pattern: "999-999-9999" });
            expect(
              coerce.string("99")
            ).toEqual("99");
        });

        it("should allow removing characters after adding them", () => {
            const coerce = new CoerceStringClass({ pattern: "(999) 999-9999" });
            expect(
              coerce.string("2345")
            ).toEqual("(234) 5");
            expect(
              coerce.string("(234) ")
            ).toEqual("(234) ");
            expect(
              coerce.string("(234)")
            ).toEqual("(234)");
            expect(
              coerce.string("(234")
            ).toEqual("(234");
        });

        it("should work statically", () => {
            expect(
              CoerceStringClass.string({ value: "234", pattern: "99/99/9999" })
            ).toEqual("23/4");
        });

        it("should support complex regex", () => {
            expect(
              CoerceStringClass.string({ value: "$234,234.234", pattern: "$D", extend: { D: '([0-9]*,?)*.[0-9]*'} })
            ).toEqual("$234,234.234");
        });

    });
}