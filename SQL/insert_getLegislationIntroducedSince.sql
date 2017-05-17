CREATE DEFINER=`capstone`@`%` PROCEDURE `insert_GetLegislationIntroducedSince`(
		Biennium varchar(45)
        ,BillNumber int
        ,SubstituteVersion int
        ,EngrossedVersion int
        ,OriginalAgency varchar(45)
        ,Active bool
        ,DisplayNumber varchar(45)
        ,StateFiscalNote bool
        ,LocalFiscalNote bool
        ,Appropriations bool
        ,RequestedByGovernor bool
        ,RequestedByBudgetCommittee bool
        ,RequestedByDepartment bool
        ,RequestedByOther bool
        ,ShortDescription varchar(45)
        ,Request varchar(45)
        ,IntroducedDate datetime
        ,Sponsor varchar(45)
        ,PrimeSponsorID int
        ,LongDescription varchar(300)
        ,LegalTitle varchar(45)
        ,ShortLegislationType varchar(45)
        ,LongLegislationType varchar(45)
        ,BillId varchar(45)
        ,HistoryLine varchar(45)
        ,ActionDate datetime
        ,AmendedByOppositeBody bool
        ,PartialVeto bool
        ,Veto bool
        ,AmendmentsExist bool
        ,Status varchar(45)
    )
BEGIN
	SET @LegislationTypeID = 0;
	IF NOT EXISTS
		(
			SELECT idLegislationType
            FROM LegislationType LT
            WHERE LT.LongLegislationType = LongLegislationType
				AND LT.ShortLegislationType = ShortLegislationType
        ) THEN
        INSERT INTO LegislationType
			(
				LongLegislationType
				,ShortLegislationType
			)
		VALUES
			(
				LongLegislationType
                ,ShortLegislationType
            );
		SET @LegislationTypeID = LAST_INSERT_ID();
	ELSE
		SET @LegislationTypeID =
			(
				SELECT idLegislationType
                FROM LegislationType LT
                WHERE LT.LongLegislationType = LongLegislationType
					AND LT.ShortLegislationType = ShortLegislationType
            );
	END IF;
    SET @LegislationStatusID = 0;
	IF NOT EXISTS
		(
			SELECT idLegislationStatus
            FROM LegislationStatus LS
            WHERE LS.ActionDate = ActionDate 
				AND LS.AmendedByOppositeBody = AmendedByOppositeBody 
				AND LS.AmendmentsExist = AmendmentsExist 
                AND LS.BillID = BillId
                AND LS.HistoryLine = HistoryLine 
                AND LS.PartialVeto = PartialVeto 
                AND LS.Status = Status 
                AND LS.Veto = Veto
		) THEN
		INSERT INTO
			LegislationStatus
				(
					BillId
					,HistoryLine
					,ActionDate
					,AmendedByOppositeBody
					,PartialVeto
					,Veto
					,AmendmentsExist
					,Status
				)
            VALUES
				(
					BillId
					,HistoryLine
					,ActionDate
					,AmendedByOppositeBody
					,PartialVeto
					,Veto
					,AmendmentsExist
					,Status
                );
			SET @LegislationStatusID = LAST_INSERT_ID();
		ELSE
			SET @LegislationStatusID =
				(
					SELECT idLegislationStatus
					FROM LegislationStatus LS
					WHERE LS.ActionDate = ActionDate 
						AND LS.AmendedByOppositeBody = AmendedByOppositeBody 
						AND LS.AmendmentsExist = AmendmentsExist 
						AND LS.BillID = BillID 
						AND LS.HistoryLine = HistoryLine 
						AND LS.PartialVeto = PartialVeto 
						AND LS.Status = Status 
						AND LS.Veto = Veto
				);
	END IF;
    
    SET @LegislationInfoID = 0;
	IF NOT EXISTS
		(
			SELECT idLegislationInfo
            FROM LegislationInfo LI
            WHERE LI.Active = Active
				AND LI.Biennium = Biennium
                AND LI.BillID = BillID
                AND LI.BillNumber = BillNumber
                AND LI.EngrossedVersion = EngrossedVersion
                AND LI.OriginalAgency = OriginalAgency
                AND LI.ShortLegislationType = ShortLegislationType
                AND LI.SubstituteVersion = SubstituteVersion
		) THEN
		INSERT INTO
			LegislationInfo
				(
					Active
					,Biennium
					,BillID
					,BillNumber
					,EngrossedVersion
					,OriginalAgency
					,ShortLegislationType
					,SubstituteVersion
				)
            VALUES
				(
					Active
					,Biennium
					,BillID
					,BillNumber
					,EngrossedVersion
					,OriginalAgency
					,ShortLegislationType
					,SubstituteVersion
                );
			SET @LegislationInfoID = LAST_INSERT_ID();
		ELSE
			SET @LegislationInfoID =
				(
					SELECT idLegislationInfo
					FROM LegislationInfo LI
					WHERE LI.Active = Active
						AND LI.Biennium = Biennium
						AND LI.BillID = BillID
						AND LI.BillNumber = BillNumber
						AND LI.EngrossedVersion = EngrossedVersion
						AND LI.OriginalAgency = OriginalAgency
						AND LI.ShortLegislationType = ShortLegislationType
						AND LI.SubstituteVersion = SubstituteVersion
				);
	END IF;
    
    IF NOT EXISTS
		(
			SELECT idLegislation
            FROM Legislation L
            WHERE L.Appropriations = Appropriations
				AND L.IntroducedDate = IntroducedDate
                AND L.LegalTitle = LegalTitle
                AND L.LocalFiscalNote = LocalFiscalNote
                AND L.LongDescription = LongDescription
                AND L.PrimeSponsorID = PrimeSponsorID
                AND L.Request = Request
                AND L.RequestedByBudgetCommittee = RequestedByBudgetCommittee
                AND L.RequestedByDepartment = RequestedByDepartment
                AND L.RequestedByGovernor = RequestedByGovernor
                AND L.RequestedByOther = RequestedByOther
                AND L.ShortDescription = ShortDescription
                AND L.Sponsor = Sponsor
                AND L.StateFiscalNote = StateFiscalNote
                AND L.LegislationType_idLegislationType = @LegislationTypeID
                AND L.LegislativeStatus_idLegislativeStatus = @LegislationStatusID
                AND L.LegislationInfo_idLegislationInfo = @LegislationInfoID
		) THEN
		INSERT INTO
			Legislation
				(
					Appropriations
                    ,IntroducedDate
                    ,LegalTitle
                    ,LocalFiscalNote
                    ,LongDescription
                    ,PrimeSponsorID
                    ,Request
                    ,RequestedByBudgetCommittee
                    ,RequestedByDepartment
                    ,RequestedByGovernor
                    ,RequestedByOther
                    ,ShortDescription
                    ,Sponsor
					,StateFiscalNote
                    ,LegislationType_idLegislationType
                    ,LegislativeStatus_idLegislativeStatus
                    ,LegislationInfo_idLegislationInfo
				)
            VALUES
				(
					Appropriations
                    ,IntroducedDate
                    ,LegalTitle
                    ,LocalFiscalNote
                    ,LongDescription
                    ,PrimeSponsorID
                    ,Request
                    ,RequestedByBudgetCommittee
                    ,RequestedByDepartment
                    ,RequestedByGovernor
                    ,RequestedByOther
                    ,ShortDescription
                    ,Sponsor
					,StateFiscalNote
                    ,@LegislationTypeID
                    ,@LegislationStatusID
                    ,@LegislationInfoID
                );
	END IF;
END