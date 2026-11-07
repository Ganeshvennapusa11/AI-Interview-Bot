/**
 * Languages the coding round accepts.
 *
 * JavaScript and Python execute in the browser, so their solutions are tested
 * and their runtime growth is measured. C++ and Java cannot run in a browser
 * without a compile service, so they are written and reviewed, and the panel
 * says plainly that nothing was executed.
 */
export const LANGUAGES = [
  {
    id: "javascript",
    label: "JavaScript",
    executable: true,
    lineComment: "//",
    note: "",
  },
  {
    id: "python",
    label: "Python",
    executable: true,
    lineComment: "#",
    note: "Runs on a Python runtime downloaded once into your browser.",
  },
  {
    id: "cpp",
    label: "C++",
    executable: false,
    lineComment: "//",
    note: "Not executed here: C++ needs a compiler. Your code is reviewed by reading it.",
  },
  {
    id: "java",
    label: "Java",
    executable: false,
    lineComment: "//",
    note: "Not executed here: Java needs a compiler. Your code is reviewed by reading it.",
  },
];

export const getLanguage = (id) =>
  LANGUAGES.find((language) => language.id === id) || LANGUAGES[0];

export const DEFAULT_LANGUAGE = "javascript";
