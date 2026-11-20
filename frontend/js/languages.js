const LANGUAGES = {
    JAVA: "Java",
    JAVASCRIPT: "JavaScript",
    C: "C",
    CPP: "C++",
    C_CHARP: "C#",
    PHYTON: "Python"
};
export function languageName(language) {
    return LANGUAGES[language] || language;
}
