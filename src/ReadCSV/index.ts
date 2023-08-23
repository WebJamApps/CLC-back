import csvtojson from 'csvtojson';

enum MatchResult {
    HomeWin = 'H',
    AwayWin = 'A',
    Draw = 'D',
}

interface IreadCSV {
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    date: string | Date;
    winner: MatchResult;
}

class ReadCSV {
    csvtojson: typeof csvtojson;
    rugbyMatches: IreadCSV[];

    constructor() {
        this.csvtojson = csvtojson;
        this.rugbyMatches = [];
    }

    irelandWins(): string {
        let ireWins = 0;
        this.rugbyMatches.map((match) => {
            if (match.homeTeam === 'Ireland' && match.winner === MatchResult.HomeWin) {
                ireWins += 1;
            } else if (match.awayTeam === 'Ireland' && match.winner === MatchResult.AwayWin) {
                ireWins += 1;
            }
            return match;
        });
        return `Ireland won ${ireWins} games`;
    }

    convertData():void {
        this.rugbyMatches = this.rugbyMatches.map((m) => {
            const match = m;
            match.homeScore = Number(match.homeScore);
            match.awayScore = Number(match.awayScore);
            if (typeof match.date !== 'string') return match;
            const tmpDateArr = match.date.split('/');
            match.date = new Date(Number(tmpDateArr[2]), Number(tmpDateArr[1]) - 1, Number(tmpDateArr[0]));
            return match;
        });
    }

    async run(): Promise<string> {
        try {
            this.rugbyMatches = await this.csvtojson({
                noheader: true,
                headers: ['homeTeam', 'awayTeam', 'homeScore', 'awayScore', 'date', 'winner'],
            }).fromFile('./src/ReadCSV/rugby.csv');
        } catch (e) { const eMessage = (e as Error).message; return `${eMessage}`;}
        return this.irelandWins();
    }
}
export default ReadCSV;
