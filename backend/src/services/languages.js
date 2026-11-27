const LANGUAGE_NAMES = {
    JAVA: "Java",
    JAVASCRIPT: "JavaScript",
    C: "C",
    CPP: "C++",
    C_CHARP: "C#",
    PHYTON: "Python"
};
export function languageName(language) {
    return LANGUAGE_NAMES[language] || language;
}
