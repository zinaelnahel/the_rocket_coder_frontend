export const quiz1 = {
  // quizTitle: "Welcome to the RoboQuiz",
  // quizSynopsis:
  //   "This quiz is designed for you to refresh your coding skills and help you on your journey to becoming a Rocket Coder 🚀",
  questions: [
    {
      question:
        "How can you access the state of a component from inside of a member function?",
      questionType: "text", // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "this.getState()",
        "this.prototype.stateValue",
        "this.state",
        "this.values",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. ",
      explanation:
        "The state is a data structure that starts with a default value when a Component mounts. It may be mutated across time, mostly as a result of user events.",
      point: "20",
    },
    {
      question: "ReactJS is developed by _____?",
      questionType: "text",
      answerSelectionType: "single",
      answers: ["Google Engineers", "Facebook Engineers"],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer. Please try again.",
      explanation:
        "The origins of this highly acclaimed technology started at Facebook. They concentrated in making React JS available and presenting it to the world as a JavaScript library to build user interfaces (UI). The responsible for this was Jordan Walke, who developed it and named it “FaxSJ”. Facebook then decided to use it with the purpose of improving and optimizing its own mobile app.",
      point: "20",
    },
    {
      question: "Which of the following concepts is/are key to ReactJS?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "Component-oriented design",
        "Event delegation model",
        "Both of the above",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "React doesn't actually attach event handlers to the nodes themselves. When React starts up, it starts listening for all events at the top level using a single event listener",
      point: "20",
    },
    {
      question: "What are the advantages of React JS?",
      questionType: "text",
      answerSelectionType: "multiple",
      answers: [
        "React can be used on client and as well as server side too",
        "Using React increases readability and makes maintainability easier. Component, Data patterns improves readability and thus makes it easier for manitaining larger apps",
        "React components have lifecycle events that fall into State/Property Updates",
        "React can be used with any other framework (Backbone.js, Angular.js) as it is only a view layer",
      ],
      correctAnswer: [1, 2, 4],
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      point: "20",
    },
    {
      question: "Arbitrary inputs of components are called __________.",
      questionType: "text",
      // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: ["Keys", "Props", "Elements", "Ref"],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called props) and return React elements describing what should appear on the screen.",
      point: "20",
    },
    {
      question:
        "_________ can be done while more than one element needs to be returned from a component.",
      questionType: "text",
      // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: ["Abstraction", "Packing", "Insultation", "Wrapping"],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      point: "20",
    },
    {
      question:
        "Which of the following needs to be updated to achieve dynamic UI updates?",
      questionType: "text",
      answerSelectionType: "single",
      answers: ["State", "Props"],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "State is a plain JavaScript object used by React to represent an information about the component's current situation. It's managed in the component (just like any variable declared in a function).",
      point: "20",
    },
    {
      question: "In JSX most of the errors can be caught during _________.",
      questionType: "text",
      // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: ["Interpretation", "Execution", "Compilation", "Build"],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "Compilation error refers to a state when a compiler fails to compile a piece of computer program source code, either due to errors in the code, or, more unusually, due to errors in the compiler itself. A compilation error message often helps programmers debugging the source code.",
      point: "20",
    },
    {
      question: "What is the smallest building block of ReactJS?",
      questionType: "text",
      // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: ["none of the options", "props", "elements", "components"],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "Elements are the smallest building blocks of React apps. An element describes what you want to see on the screen: const element = <h1>Hello, world</h1>; Unlike browser DOM elements, React elements are plain objects, and are cheap to create.",
      point: "20",
    },
    {
      question: "What is Babel?",
      questionType: "text",
      // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "A transpiler",
        "An interpreter",
        "A Compiler",
        "Both Compiler and Transpilar",
      ],
      correctAnswer: "4",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "A transpiler is a compiler like program, which convert ES6 JavaScript code to ES5 JavaScript code so that it can run in browsers. ",
      point: "20",
    },
    {
      question: "What does the webpack command do?",
      questionType: "text",
      // if you need to display Picture in Question
      answerSelectionType: "single",
      answers: [
        "Transpiles all the Javascript down into one file",
        "Runs react local development server.",
        "A module bundler",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "Webpack is a static module bundler for JavaScript applications — it takes all the code from your application and makes it usable in a web browser. ",
      point: "20",
    },
    {
      question: "ReactJS uses _____ to increase performance",
      questionType: "text",
      answerSelectionType: "single",
      answers: ["Original DOM", "Virtual DOM", "Both 1 & 2", "None of above"],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "In simple words, virtual DOM is just a copy of the original DOM kept in the memory and synced with the real DOM by libraries such as ReactDOM.  ",
      point: "20",
    },
    {
      question:
        "Which of the following is true about variable naming conventions in JavaScript?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "You should not use any of the JavaScript reserved keyword as variable name.",
        "JavaScript variable names should not start with a numeral (0-9).",
        "Both of the above.",
        "None of above",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation: "Both of the above options are correct. ",
      point: "20",
    },
    {
      question:
        "Which of the following is a valid type of function javascript supports?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "named function",
        "anonymous function",
        "Both of the above.",
        "None of above",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation: "A function in JavaScript can be either named or anonymous.",
      point: "20",
    },
    {
      question: "Which of the following is correct about callbacks?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        " A callback is a plain JavaScript function passed to some method as an argument or option.",
        "Some callbacks are just events, called to give the user a chance to react when a certain state is triggered.",
        " Both of the above.",
        "None of above",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "A callback is a plain JavaScript function passed to some method as an argument or option. Some callbacks are just events, called to give the user a chance to react when a certain state is triggered.",
      point: "20",
    },
    {
      question: "Which built-in method sorts the elements of an array?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "changeOrder(order)",
        "order()",
        " sort()",
        "None of the above.",
      ],
      correctAnswer: "3",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation: "sort() method sorts the elements of an array.",
      point: "20",
    },
    {
      question:
        "Which of the following function of Number object returns the number's value?",
      questionType: "text",
      answerSelectionType: "single",
      answers: ["toString()", "valueOf()", "toLocaleString()", "toPrecision()"],
      correctAnswer: "2",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation: "valueOf() − Returns the number's value.",
      point: "20",
    },
    {
      question:
        "Which of the following function of String object extracts a section of a string and returns a new string?",
      questionType: "text",
      answerSelectionType: "single",
      answers: ["slice()", "split()", "replace()", "search()"],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "slice() − Extracts a section of a string and returns a new string.",
      point: "20",
    },
    {
      question:
        "Which of the following function of String object returns the calling string value converted to upper case while respecting the current locale?",
      questionType: "text",
      answerSelectionType: "single",
      answers: [
        "toLocaleUpperCase()",
        "toUpperCase()",
        "toString()",
        "substring()",
      ],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "toLocaleUpperCase() − Returns the calling string value converted to upper case while respecting the current locale.",
      point: "20",
    },
    {
      question:
        " Which of the following function of Array object removes the last element from an array and returns that element?",
      questionType: "text",
      answerSelectionType: "single",
      answers: ["pop()", "push()", "join()", "map()"],
      correctAnswer: "1",
      messageForCorrectAnswer: "Correct answer. Good job.",
      messageForIncorrectAnswer: "Incorrect answer.",
      explanation:
        "pop() − Removes the last element from an array and returns that element.",
      point: "20",
    },
  ],
};
