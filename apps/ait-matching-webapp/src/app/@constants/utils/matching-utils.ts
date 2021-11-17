export class MatchingUtils {
    static getFormatYearMonth(input: string): string {
        if (!input) {
            return '';
        }
        const index = input.indexOf('dd');
        switch (index) {
            case 0:
                return input.slice(3);
            case 3:
                return input.slice(0, index) + input.slice(index + 3);
            case 8:
                return input.slice(0, -3);
            default:
                return '';
        }
    }
}