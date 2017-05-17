CREATE DEFINER=`capstone`@`%` PROCEDURE `insert_CommitteeMeetingService`(
		Agency varchar(45)
        ,AgendaId INT
        ,Building varchar(45)
        ,Cancelled bool
        ,City varchar(45)
        ,ContactInformation varchar(45)
        ,Date datetime
        ,RevisedDate datetime
        ,Room varchar(45)
        ,State varchar(45)
        ,ZipCode int
        ,phoneList text
        ,acronymList text
        ,agencyList text
        ,idList text
        ,longnameList text
        ,nameList text
        ,committeeLength INT
	)
BEGIN
	SET @CommitteeMeetingsID = 0;
	IF NOT EXISTS (SELECT idCommitteeMeeting FROM CommitteeMeetings CM WHERE CM.AgendaID = AgendaId) THEN
		INSERT INTO CommitteeMeetings
		(
			Agency
			,AgendaID
			,Building
			,Cancelled
			,City
			,ContactInformation
			,Date
			,RevisedDate
			,Room
			,State
			,Zipcode
		)
		VALUES
		(
			Agency
			,AgendaId
			,Building
			,Cancelled
			,City
			,ContactInformation
			,Date
			,RevisedDate
			,Room
			,State
			,ZipCode
		);
        SET @CommitteeMeetingsID = LAST_INSERT_ID();
	ELSE
		SET @CommitteeMeetingsID =
			(
				SELECT idCommitteeMeeting FROM CommitteeMeetings CM WHERE CM.AgendaID = AgendaId
            );
	END IF;

    SET @COUNT = 1;
    WHILE (@COUNT <= CommitteeLength) DO
		SET @CommitteeID = 0;
		IF NOT EXISTS (SELECT idCommittee FROM Committee C WHERE C.ID = (SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(idList, ',', @COUNT), ",", -1) AS UNSIGNED))) THEN
			INSERT IGNORE INTO Committee
			(
				Phone
				,Acronym
				,Agency
				,ID
				,LongName
				,Name
			)
			VALUES
			(
				SUBSTRING_INDEX(SUBSTRING_INDEX(phoneList, ',', @COUNT), ',', -1)
				, SUBSTRING_INDEX(SUBSTRING_INDEX(acronymList, ',', @COUNT), ",", -1)
				, SUBSTRING_INDEX(SUBSTRING_INDEX(agencyList, ',', @COUNT), ",", -1)
				, CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(idList, ',', @COUNT), ",", -1) AS UNSIGNED)
				, SUBSTRING_INDEX(SUBSTRING_INDEX(longnameList, ',', @COUNT), ",", -1)
				, SUBSTRING_INDEX(SUBSTRING_INDEX(nameList, ',', @COUNT), ",", -1)
			);
            SET @CommitteeID = LAST_INSERT_ID();
		ELSE
			SET @CommitteeID =
				(
					SELECT idCommittee FROM Committee C WHERE C.ID = (SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(idList, ',', @COUNT), ",", -1) AS UNSIGNED))
				);
		END IF;
        
        IF NOT EXISTS (SELECT * FROM CommitteeMeetings_Committees WHERE CommitteeMeetings_idCommitteeMeeting = @CommitteeMeetingsID AND Committee_idCommittee = @CommitteeID) THEN
			INSERT INTO CommitteeMeetings_Committees
				(
					CommitteeMeetings_idCommitteeMeeting
					,Committee_idCommittee
				)
			VALUES
				(
					@CommitteeMeetingsID
					,@CommitteeID
				);
        END IF;
		SET @COUNT = @COUNT + 1;
	END WHILE;
END