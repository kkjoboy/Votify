CREATE DEFINER=`capstone`@`%` PROCEDURE `insert_RollCalls`(
		idLegislationInfo INT
        ,Agency varchar(45)
        ,BillId varchar(45)
		,Biennium varchar(45)
		,Motion varchar(45)
		,SequenceNumber varchar(45)
        ,VoteDate varchar(45)
        ,MemberIdList text
        ,NameList text
        ,VoteList text
        ,VoteLength INT
	)
BEGIN
	SET @RollCallID = 0;
	IF NOT EXISTS 
		(
			SELECT
				idRollCall
            FROM
				RollCall R
			WHERE
				R.Agency = Agency
                AND R.BillId = BillId
				AND R.Biennium = Biennium
                AND R.Motion = Motion
                AND R.SequenceNumber = SequenceNumber
                AND R.VoteDate = VoteDate
		) THEN
		INSERT INTO RollCall
		(
			Agency
			,BillId
            ,Biennium
            ,Motion
            ,SequenceNumber
            ,VoteDate
            ,LegislationInfo_idLegislationInfo
		)
		VALUES
		(
			Agency
            ,BillId
            ,Biennium
            ,Motion
            ,SequenceNumber
            ,VoteDate
            ,idLegislationInfo
		);
        SET @RollCallID = LAST_INSERT_ID();
	ELSE
		SET @RollCallID =
			(
				SELECT
					idRollCall
				FROM
					RollCall R
				WHERE
					R.Agency = Agency
					AND R.BillId = BillId
					AND R.Biennium = Biennium
					AND R.Motion = Motion
					AND R.SequenceNumber = SequenceNumber
					AND R.VoteDate = VoteDate
            );
	END IF;

    SET @COUNT = 1;
    SET @SponsorID = 0;
    WHILE (@COUNT <= VoteLength) DO
		SET @SponsorID =
			(
				SELECT
					idSponsor
				FROM
					Sponsor S
				WHERE
					S.ID = (SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(MemberIdList, ',', @COUNT), ",", -1) AS UNSIGNED))
            );
		IF NOT EXISTS
			(
				SELECT
					idVote
				FROM
					Vote V
				WHERE
					V.Sponsor_idSponsor = (SELECT CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(MemberIdList, ',', @COUNT), ",", -1) AS UNSIGNED))
			) THEN
			INSERT INTO Vote
				(
					Vote
					,RollCall_idRollCall
					,RollCall_LegislationInfo_idLegislationInfo
					,Sponsor_idSponsor
				)
			VALUES
				(
					(SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(VoteList, ',', @COUNT), ",", -1))
					,@RollCallID
					,idLegislationInfo
					,@SponsorID
				);
		END IF;
		SET @COUNT = @COUNT + 1;
	END WHILE;
END