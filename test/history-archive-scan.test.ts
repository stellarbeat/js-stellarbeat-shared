import {HistoryArchiveScan} from "../src/history-archive-scan";

it('should map from json', function () {
    const url = 'https://history.stellarbeat.io';
    const startDate = '2000/01/01';
    const endDate = '2000/01/02';
    const latestVerifiedLedger = 100
    const hasGap = true;
    const gapUrl = 'https://history.stellarbeat.io/gap';
    const gapCheckPoint = 20;

    const scanDTO = {
        url: url,
        startDate: startDate,
        endDate: endDate,
        latestVerifiedLedger: latestVerifiedLedger,
        hasGap: hasGap,
        gapUrl: gapUrl,
        gapCheckPoint: gapCheckPoint
    }

    expect(HistoryArchiveScan.fromJSON(scanDTO)).toEqual(new HistoryArchiveScan(url, new Date(startDate), new Date(endDate), latestVerifiedLedger, hasGap, gapUrl, gapCheckPoint));
});