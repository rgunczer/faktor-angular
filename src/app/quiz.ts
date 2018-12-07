export class Quiz {
    passingMark: 0;
    questions: any[] = [];

    reset() {
        this.passingMark = 0;
        this.questions.length = 0;
    }
}
