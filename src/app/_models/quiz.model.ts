export class Quiz {
    sectionId: 0;
    passingMark: 0;
    questions: any[] = [];

    reset() {
        this.passingMark = 0;
        this.questions.length = 0;
    }
}
