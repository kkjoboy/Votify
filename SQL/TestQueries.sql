SELECT * FROM legwagov.Amendments;
SELECT * FROM legwagov.Committee;
SELECT * FROM legwagov.CommitteeMeetings;
SELECT * FROM legwagov.CommitteeMeetings_Committees;

SELECT * FROM legwagov.Legislation;
SELECT * FROM legwagov.LegislationInfo;
SELECT * FROM legwagov.LegislationType;
SELECT * FROM legwagov.LegislativeStatus;

call sp_split('hi,hi,hi',',',0);

SELECT SUBSTRING_INDEX(SUBSTRING_INDEX('a|bb|ccc|dd', '|', 3), “|”, -1);

call insert_CommitteeMeetingService("Senate", 27552, "J.A. Cherberg Building", False, "Olympia", NULL, CAST("2017-04-20 10:00:00" AS datetime), CAST("0001-01-01 00:00:00" as Datetime),"Senate Hearing Rm 4"
,"WA",98504,NULL,"WM","Senate","456","Senate Ways & Means","Ways & Means",1);

SELECT idCommittee FROM Committee C WHERE C.ID = (SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX('-1', ',', 1), ",", -1) AS UNSIGNED));